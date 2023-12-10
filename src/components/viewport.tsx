import { useCallback, useEffect, useState } from "react"
import Piece from "./pieces/piece"
import { twMerge } from "tailwind-merge"
import { Atom } from "./pieces/atom"
import { GamePiece, PieceAtom } from "./types"
import { VIEWPORT_HEIGHT, REFRESH_RATE, PIXEL_SIZE, VIEWPORT_WIDTH, GameKeys } from "./constants"
import * as AllPieces from "./pieces/pieces"
import { generateRandomPiece } from "@/utils/pieces"
import Game from "../app/game/page"
import { ComingPieces } from "./coming-pieces-box"

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
  return piece.y + pieceHeight === VIEWPORT_HEIGHT
}

function checkIfPieceHitsLeftBorder(piece: GamePiece) {
  return piece.x === 0
}

function checkIfPieceHitsRightBorder(piece: GamePiece) {
  const { width: pieceWidth } = getAtomsDimensions(piece.piece.atoms)
  return piece.x + pieceWidth >= VIEWPORT_WIDTH
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
        x: currentPieceInViewport.x + atom.x,
        y: currentPieceInViewport.y + atom.y,
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

function removeYLineAtoms(atoms: PieceAtom[], y: number): PieceAtom[] {
  return atoms.filter((atom) => atom.y !== y)
}

function repositionAtomsBelowY(atoms: PieceAtom[], y: number): PieceAtom[] {
  return atoms.map((atom) => {
    if (atom.y < y) {
      return {
        ...atom,
        y: atom.y + 1,
      }
    }

    return atom
  })
}

function isLineComplete(lineAtoms: PieceAtom[]): boolean {
  return lineAtoms.length === VIEWPORT_WIDTH
}

function removeCompletedLines(gameState: PieceAtom[]): PieceAtom[] {
  const YLines = getYLinesFromCurrentGameState(gameState)

  const completedYLines = YLines.filter((lineAtoms) => {
    return isLineComplete(lineAtoms)
  })

  const uncompletedYLines = YLines.filter((lineAtoms) => {
    return !isLineComplete(lineAtoms)
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
  comingPieces: ComingPieces
  currentPieceInViewport: GamePiece
  onComingPiecesChange?: (comingPieces: ComingPieces) => void
  onCurrentPieceChange?: (piece: GamePiece) => void
}

function Viewport(props: ViewportProps) {
  const { comingPieces, currentPieceInViewport, onComingPiecesChange, onCurrentPieceChange } = props

  const [gameOver, setGameOver] = useState(false)
  const [currentGameState, setCurrentGameState] = useState<PieceAtom[]>([])

  const addPieceToGameState = useCallback(
    (piece: GamePiece) => {
      const newGameState = [
        ...currentGameState,
        ...piece.piece.atoms.map((internalAtomCoords) => ({
          x: piece.x + internalAtomCoords.x,
          y: piece.y + internalAtomCoords.y,
        })),
      ]

      setCurrentGameState(removeCompletedLines(newGameState))
      onCurrentPieceChange?.(comingPieces.piece1)
      onComingPiecesChange?.({
        piece1: comingPieces.piece2,
        piece2: comingPieces.piece3,
        piece3: generateRandomPiece(),
      })
    },
    [
      comingPieces.piece1,
      comingPieces.piece2,
      comingPieces.piece3,
      currentGameState,
      onComingPiecesChange,
      onCurrentPieceChange,
    ],
  )

  const moveCurrentPieceDown1 = useCallback(() => {
    const futurePieceInViewport = {
      ...currentPieceInViewport,
      y: currentPieceInViewport.y + 1,
    }

    const futurePieceHitsOtherPieces = checkIfPieceHitsOtherPieces(
      { ...futurePieceInViewport, y: futurePieceInViewport.y + 1 },
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
      console.log("EV KEY", ev.key)
      if (ev.key === GameKeys.ArrowLeft) {
        const pieceHitsLeftBorder = checkIfPieceHitsLeftBorder(currentPieceInViewport)
        if (pieceHitsLeftBorder) return

        const futureCurrentPieceInViewport: GamePiece = {
          ...currentPieceInViewport,
          x: currentPieceInViewport.x - 1,
        }
        const pieceHasHitOtherPieces = checkIfPieceHitsOtherPieces(
          futureCurrentPieceInViewport,
          currentGameState,
        )
        if (pieceHasHitOtherPieces) return

        onCurrentPieceChange?.(futureCurrentPieceInViewport)
      } else if (ev.key === GameKeys.ArrowRight) {
        const pieceHitsRightBorder = checkIfPieceHitsRightBorder(currentPieceInViewport)
        if (pieceHitsRightBorder) return

        const futureCurrentPieceInViewport: GamePiece = {
          ...currentPieceInViewport,
          x: currentPieceInViewport.x + 1,
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

        const pieceHitsRightBorder = checkIfPieceHitsRightBorder(futureCurrentPieceInViewport)
        if (pieceHitsRightBorder) {
          const { width: pieceWidth } = getAtomsDimensions(futureCurrentPieceInViewport.piece.atoms)
          const exceedingWidth = futureCurrentPieceInViewport.x + pieceWidth - VIEWPORT_WIDTH
          futureCurrentPieceInViewport.x -= exceedingWidth
        }

        onCurrentPieceChange?.(futureCurrentPieceInViewport)
      } else if (ev.key === GameKeys.Space) {
        for (let i = currentPieceInViewport.y + 1; i <= VIEWPORT_HEIGHT; i++) {
          const futureCurrentPieceInViewport = {
            ...currentPieceInViewport,
            y: i,
          }

          const futurePieceHitsOtherPieces =
            checkIfPieceHitsOtherPieces(
              { ...futureCurrentPieceInViewport, y: futureCurrentPieceInViewport.y + 1 },
              currentGameState,
            ) || checkIfPieceHitsBottom(futureCurrentPieceInViewport)
          if (futurePieceHitsOtherPieces) {
            addPieceToGameState(futureCurrentPieceInViewport)
            break
          }
        }
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
  ])

  // Game loop
  useEffect(() => {
    if (gameOver) return

    const heightIsFull = currentGameState.some((atom) => atom.y === 0)
    if (heightIsFull) {
      console.log("GAME OVER")
      setGameOver(true)
      return
    }

    const interval = setInterval(() => {
      moveCurrentPieceDown1()
    }, REFRESH_RATE)

    return () => clearInterval(interval)
  }, [currentGameState, gameOver, moveCurrentPieceDown1])

  return (
    <div className="relative box-content flex h-[800px] w-[400px] items-center justify-center border-4 border-solid border-gray-600 bg-black">
      <Piece
        atoms={currentPieceInViewport.piece.atoms}
        className={twMerge("absolute")}
        style={{
          top: currentPieceInViewport.y * PIXEL_SIZE,
          left: currentPieceInViewport.x * PIXEL_SIZE,
        }}
        color={currentPieceInViewport.piece.color}
      />

      {currentGameState.map((atom, i) => (
        <Atom
          className={twMerge("absolute bg-orange-300")}
          key={i}
          style={{
            top: atom.y * PIXEL_SIZE,
            left: atom.x * PIXEL_SIZE,
          }}
        />
      ))}
    </div>
  )
}

export default Viewport
