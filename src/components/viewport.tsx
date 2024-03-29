import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react"
import { twMerge } from "tailwind-merge"

import { generateRandomPiece } from "@/utils/pieces"

import { Box } from "./box"
import { ComingPieces } from "./coming-pieces-box"
import { GameKeys, PIXEL_SIZE, REFRESH_RATE, VIEWPORT_HEIGHT } from "./constants"
import { Atom } from "./pieces/atom"
import Piece from "./pieces/piece"
import { GamePiece, PieceAtom } from "./types"

function getAtomsDimensions(atoms: PieceAtom[]) {
  const pieceSortedByHeight = atoms.toSorted((a, b) => {
    return a.y > b.y ? -1 : 1
  })
  const pieceSortedByWidth = atoms.toSorted((a, b) => {
    return a.x > b.x ? -1 : 1
  })

  return {
    width: pieceSortedByWidth[0].x + 1,
    height: pieceSortedByHeight[0].y + 1,
  }
}

function checkIfPieceHitsBottom(piece: GamePiece): boolean {
  const pieceHeight = getAtomsDimensions(piece.piece.atoms).height
  return piece.coords.y + pieceHeight === VIEWPORT_HEIGHT
}

function checkIfPieceHitsLeftBorder(piece: GamePiece) {
  return piece.coords.x === 0
}

function checkIfPieceHitsRightBorder(piece: GamePiece, width: number) {
  const { width: pieceWidth } = getAtomsDimensions(piece.piece.atoms)
  return piece.coords.x + pieceWidth >= width
}

// TODO: When a function's only purpose is to iterate over an array an do something inside that iteration
// Then the function should be refactored to only to the task inside the array.
function checkIfAtomCollidesWithOtherAtoms(atom: PieceAtom, otherAtoms: PieceAtom[]): boolean {
  return otherAtoms.some((currentAtom) => atom.x === currentAtom.x && atom.y === currentAtom.y)
}

// TODO: When a function's only purpose is to iterate over an array an do something inside that iteration
// Then the function should be refactored to only to the task inside the array.
function checkIfPieceHitsOtherPieces(
  currentPieceInViewport: GamePiece,
  currentGameState: PieceAtom[],
): boolean {
  return currentPieceInViewport.piece.atoms.some((atom) =>
    checkIfAtomCollidesWithOtherAtoms(
      {
        x: currentPieceInViewport.coords.x + atom.x,
        y: currentPieceInViewport.coords.y + atom.y,
      },
      currentGameState,
    ),
  )
}

// TODO: When a function's only purpose is to iterate over an array an do something inside that iteration
// Then the function should be refactored to only to the task inside the array.
function rotateAtomsToTheRight(atoms: PieceAtom[]) {
  return atoms.map(({ x, y }) => {
    const dimensions = getAtomsDimensions(atoms)
    const width = dimensions.height - 1 // We substract 1 because the coords start at 0

    return {
      x: width - y,
      y: x,
    }
  })
}

function getYLinesFromCurrentGameState(gameState: PieceAtom[]): PieceAtom[][] {
  const result: PieceAtom[][] = []

  gameState.forEach(({ x, y }) => {
    if (!result[y]) {
      result[y] = []
    }

    result[y].push({ x, y })
  })

  return result
}

function isLineComplete(lineAtoms: PieceAtom[], width: number): boolean {
  return lineAtoms.length === width
}

function removeCompletedLines(gameState: PieceAtom[], width: number): PieceAtom[] {
  const YLines = getYLinesFromCurrentGameState(gameState)

  const completedYLines = YLines.filter((lineAtoms) => {
    return isLineComplete(lineAtoms, width)
  })

  const uncompletedYLines = YLines.filter((lineAtoms) => {
    return !isLineComplete(lineAtoms, width)
  })

  return completedYLines
    .reduce((acc, completedLine) => {
      const completedY = completedLine[0].y

      return acc.map((uncompletedLine) => {
        const lineShouldReposition = uncompletedLine[0].y < completedY
        if (lineShouldReposition) {
          // This below is equal to `repositionAtomsBelowY()`
          return uncompletedLine.map((lineAtom) => ({
            ...lineAtom,
            y: lineAtom.y + 1,
          }))
        }

        return uncompletedLine
      })
    }, uncompletedYLines)
    .flat()
}

interface ViewportProps {
  currentPieceInViewport: GamePiece
  onCurrentPieceChange?: (piece: GamePiece) => void
  onHoldBoxClick?: () => void
  onNextStepTrigger?: () => void
  width: number
}

function Viewport(props: PropsWithChildren<ViewportProps>) {
  const { children, width } = props

  const currentGameState = useGameState(props)
  const shadowPiece = useShadowPiece({ ...props, currentGameState })

  return (
    <div className="relative h-full w-full" style={{ width: PIXEL_SIZE * width + "px" }}>
      {shadowPiece && (
        <Box.Place {...shadowPiece.coords}>
          <Piece
            atoms={shadowPiece.piece.atoms}
            className={twMerge("z-10")}
            style={{
              top: shadowPiece.coords.y * PIXEL_SIZE,
              left: shadowPiece.coords.x * PIXEL_SIZE,
            }}
            color={shadowPiece.piece.color}
          />
        </Box.Place>
      )}

      {children}

      {currentGameState.map((atom, i) => (
        <Box.Place {...atom} key={i}>
          <Atom className={twMerge("bg-orange-300")} />
        </Box.Place>
      ))}
    </div>
  )
}

export default Viewport

function useGameState({
  currentPieceInViewport,
  width,
  onCurrentPieceChange,
  onHoldBoxClick,
  onNextStepTrigger,
}: ViewportProps) {
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
    [currentGameState, onNextStepTrigger, width],
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
  }, [currentGameState])

  return currentGameState
}

function useShadowPiece({
  currentPieceInViewport,
  currentGameState,
}: {
  currentPieceInViewport: GamePiece
  currentGameState: PieceAtom[]
}) {
  const shadowPiece = useMemo(() => {
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
        return {
          ...futureCurrentPieceInViewport,
          piece: {
            ...futureCurrentPieceInViewport.piece,
            color: "#000",
          },
        }
      }
    }
  }, [currentGameState, currentPieceInViewport])

  return shadowPiece
}
