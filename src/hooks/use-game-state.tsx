import { useCallback, useEffect, useState } from "react"

import { GameKeys, REFRESH_RATE, VIEWPORT_HEIGHT } from "../components/constants"
import { GamePiece, PieceAtom } from "../components/types"
import {
  checkIfPieceHitsBottom,
  checkIfPieceHitsLeftBorder,
  checkIfPieceHitsOtherPieces,
  checkIfPieceHitsRightBorder,
  getAtomsDimensions,
  removeCompletedLines,
  rotateAtomsToTheRight,
} from "../utils/atom-utils"

type UseGameStateProps = {
  currentPieceInViewport: GamePiece
  onCurrentPieceChange?: (piece: GamePiece) => void
  onHoldBoxClick?: () => void
  onNextStepTrigger?: () => void
  width: number
}

export function useGameState({
  currentPieceInViewport,
  width,
  onCurrentPieceChange,
  onHoldBoxClick,
  onNextStepTrigger,
}: UseGameStateProps) {
  const [gameOver, setGameOver] = useState(false)
  const [currentGameState, setCurrentGameState] = useState<PieceAtom[]>([])

  const addPieceToGameState = useCallback(
    (piece: GamePiece) => {
      const newGameState = [
        ...currentGameState,
        ...piece.piece.atoms.map((internalAtomCoords) => ({
          x: piece.coords.x + internalAtomCoords.x,
          y: piece.coords.y + internalAtomCoords.y,
        })),
      ]

      setCurrentGameState(removeCompletedLines(newGameState, width))
      onNextStepTrigger?.()
    },
    [currentGameState, onNextStepTrigger, setCurrentGameState, width],
  )

  const moveCurrentPieceDown1 = useCallback(() => {
    const futurePieceInViewport: GamePiece = {
      ...currentPieceInViewport,
      coords: { ...currentPieceInViewport.coords, y: currentPieceInViewport.coords.y + 1 },
    }
    const futurePieceHitsOtherPieces = checkIfPieceHitsOtherPieces(
      {
        ...futurePieceInViewport,
        coords: { ...futurePieceInViewport.coords, y: futurePieceInViewport.coords.y + 1 },
      },
      currentGameState,
    )
    const futurePieceHitsBottom = checkIfPieceHitsBottom(futurePieceInViewport)
    if (futurePieceHitsOtherPieces || futurePieceHitsBottom) {
      addPieceToGameState(futurePieceInViewport)
      return
    }

    onCurrentPieceChange?.(futurePieceInViewport)
  }, [addPieceToGameState, currentGameState, currentPieceInViewport, onCurrentPieceChange])

  useEffect(() => {
    if (gameOver) return

    const handleKeydown = (ev: KeyboardEvent) => {
      if (ev.key === GameKeys.ArrowLeft) {
        const pieceHitsLeftBorder = checkIfPieceHitsLeftBorder(currentPieceInViewport)
        if (pieceHitsLeftBorder) return

        const futureCurrentPieceInViewport: GamePiece = {
          ...currentPieceInViewport,
          coords: {
            ...currentPieceInViewport.coords,
            x: currentPieceInViewport.coords.x - 1,
          },
        }
        const pieceHasHitOtherPieces = checkIfPieceHitsOtherPieces(
          futureCurrentPieceInViewport,
          currentGameState,
        )
        if (pieceHasHitOtherPieces) return

        onCurrentPieceChange?.(futureCurrentPieceInViewport)
      } else if (ev.key === GameKeys.ArrowRight) {
        const pieceHitsRightBorder = checkIfPieceHitsRightBorder(currentPieceInViewport, width)
        if (pieceHitsRightBorder) return

        const futureCurrentPieceInViewport: GamePiece = {
          ...currentPieceInViewport,
          coords: {
            ...currentPieceInViewport.coords,
            x: currentPieceInViewport.coords.x + 1,
          },
        }
        const pieceHasHitOtherPieces = checkIfPieceHitsOtherPieces(
          futureCurrentPieceInViewport,
          currentGameState,
        )
        if (pieceHasHitOtherPieces) return

        onCurrentPieceChange?.(futureCurrentPieceInViewport)
      } else if (ev.key === GameKeys.ArrowDown) {
        moveCurrentPieceDown1()
      } else if (ev.key === GameKeys.ArrowUp) {
        const futureCurrentPieceInViewport = {
          ...currentPieceInViewport,
          piece: {
            ...currentPieceInViewport.piece,
            atoms: rotateAtomsToTheRight(currentPieceInViewport.piece.atoms),
          },
        }

        const pieceHitsRightBorder = checkIfPieceHitsRightBorder(
          futureCurrentPieceInViewport,
          width,
        )
        if (pieceHitsRightBorder) {
          const { width: pieceWidth } = getAtomsDimensions(futureCurrentPieceInViewport.piece.atoms)
          const exceedingWidth = futureCurrentPieceInViewport.coords.x + pieceWidth - width
          futureCurrentPieceInViewport.coords.x -= exceedingWidth
        }

        onCurrentPieceChange?.(futureCurrentPieceInViewport)
      } else if (ev.key === GameKeys.Space) {
        for (let i = currentPieceInViewport.coords.y + 1; i <= VIEWPORT_HEIGHT; i++) {
          const futureCurrentPieceInViewport = {
            ...currentPieceInViewport,
            coords: {
              ...currentPieceInViewport.coords,
              y: i,
            },
          }

          const futurePieceHitsOtherPieces =
            checkIfPieceHitsOtherPieces(
              {
                ...futureCurrentPieceInViewport,
                coords: {
                  ...futureCurrentPieceInViewport.coords,
                  y: futureCurrentPieceInViewport.coords.y + 1,
                },
              },
              currentGameState,
            ) || checkIfPieceHitsBottom(futureCurrentPieceInViewport)
          if (futurePieceHitsOtherPieces) {
            addPieceToGameState(futureCurrentPieceInViewport)
            break
          }
        }
      } else if (ev.key === GameKeys.Shift) {
        onHoldBoxClick?.()
      }
    }

    addEventListener("keydown", handleKeydown)

    return () => removeEventListener("keydown", handleKeydown)
  }, [
    addPieceToGameState,
    currentGameState,
    currentPieceInViewport,
    gameOver,
    moveCurrentPieceDown1,
    onCurrentPieceChange,
    onHoldBoxClick,
    width,
  ])

  // Game loop
  useEffect(() => {
    if (gameOver) return

    const interval = setInterval(() => {
      moveCurrentPieceDown1()
    }, REFRESH_RATE)
    return () => clearInterval(interval)
  }, [gameOver, moveCurrentPieceDown1])

  useEffect(() => {
    const heightIsFull = currentGameState.some((atom) => atom.y === 1)
    if (heightIsFull) {
      console.log("GAME OVER")
      setGameOver(true)
      return
    }
  }, [currentGameState, setGameOver])

  return currentGameState
}
