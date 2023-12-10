import { useCallback, useEffect, useState } from "react"
import Piece from "./pieces/piece"
import { twMerge } from "tailwind-merge"
import { Atom } from "./pieces/atom"
import { GamePiece, PieceAtom } from "./types"
import { VIEWPORT_HEIGHT, REFRESH_RATE, PIXEL_SIZE, VIEWPORT_WIDTH } from "./constants"
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

function checkIfPieceHitsBottom(currentPiece: GamePiece): boolean {
  const pieceHeight = getAtomsDimensions(currentPiece.piece.atoms).height
  return currentPiece.y === VIEWPORT_HEIGHT - pieceHeight
}

// TODO: When a function's only purpose is to iterate over an array an do something inside that iteration
// Then the function should be refactored to only to the task inside the array.
function checkIfAtomCollidesWithOtherAtoms(atom: PieceAtom, otherAtoms: PieceAtom[]): boolean {
  return otherAtoms.some((currentAtom) => currentAtom.x === atom.x && currentAtom.y === atom.y + 1)
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

  useEffect(() => {
    if (gameOver) return

    const handleKeydown = (ev: KeyboardEvent) => {
      console.log("EV KEY", ev.key)
      if (ev.key === "ArrowLeft") {
        const futureCurrentPieceInViewport: GamePiece = {
          ...currentPieceInViewport,
          x: currentPieceInViewport.x - 1,
        }
        const pieceHasHitOtherPieces = checkIfPieceHitsOtherPieces(
          futureCurrentPieceInViewport,
          currentGameState,
        )
        if (pieceHasHitOtherPieces) return

        const hasHitBorder = futureCurrentPieceInViewport.piece.atoms.some((atom) => {
          const atomNextX = futureCurrentPieceInViewport.x + atom.x
          return atomNextX < 0
        })
        if (hasHitBorder) return

        onCurrentPieceChange?.(futureCurrentPieceInViewport)
      } else if (ev.key === "ArrowRight") {
        const futureCurrentPieceInViewport: GamePiece = {
          ...currentPieceInViewport,
          x: currentPieceInViewport.x + 1,
        }
        const pieceHasHitOtherPieces = checkIfPieceHitsOtherPieces(
          futureCurrentPieceInViewport,
          currentGameState,
        )
        if (pieceHasHitOtherPieces) return

        const hasHitBorder = currentPieceInViewport.piece.atoms.some((atom) => {
          const atomNextX = currentPieceInViewport.x + atom.x + 1
          return atomNextX >= VIEWPORT_WIDTH
        })
        if (hasHitBorder) return

        onCurrentPieceChange?.(futureCurrentPieceInViewport)
      } else if (ev.key === "ArrowDown") {
        const futureCurrentPieceInViewport: GamePiece = {
          ...currentPieceInViewport,
          y: currentPieceInViewport.y + 1,
        }
        const pieceHasHitOtherPieces = checkIfPieceHitsOtherPieces(
          futureCurrentPieceInViewport,
          currentGameState,
        )
        if (pieceHasHitOtherPieces) return currentPieceInViewport

        onCurrentPieceChange?.(futureCurrentPieceInViewport)
      } else if (ev.key === "ArrowUp") {
        const futureCurrentPieceInViewport = {
          ...currentPieceInViewport,
          piece: {
            ...currentPieceInViewport.piece,
            atoms: rotateAtomsToTheRight(currentPieceInViewport.piece.atoms),
          },
        }
        const { width: pieceWidth } = getAtomsDimensions(futureCurrentPieceInViewport.piece.atoms)

        const hasHitBorder = currentPieceInViewport.x + pieceWidth >= VIEWPORT_WIDTH
        if (hasHitBorder) {
          const exceedingWidth = futureCurrentPieceInViewport.x + pieceWidth - VIEWPORT_WIDTH
          futureCurrentPieceInViewport.x -= exceedingWidth
        }

        onCurrentPieceChange?.(futureCurrentPieceInViewport)
      } else if (ev.key === " ") {
        const futureCurrentPieceInViewport = {
          ...currentPieceInViewport,
          y: currentPieceInViewport.y + 1,
        }

        while (futureCurrentPieceInViewport.y <= VIEWPORT_HEIGHT) {
          const hit =
            checkIfPieceHitsOtherPieces(futureCurrentPieceInViewport, currentGameState) ||
            checkIfPieceHitsBottom(futureCurrentPieceInViewport)
          if (hit) {
            addPieceToGameState(futureCurrentPieceInViewport)
            break
          } else {
            futureCurrentPieceInViewport.y += 1
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
    onCurrentPieceChange,
  ])

  // Game loop
  useEffect(() => {
    if (gameOver) return

    console.log(currentGameState)
    const heightIsFull = currentGameState.some((atom) => atom.y === 0)
    if (heightIsFull) {
      console.log("GAME OVER")
      setGameOver(true)
      return
    }

    const interval = setInterval(() => {
      const newY = currentPieceInViewport.y + 1
      onCurrentPieceChange?.({
        ...currentPieceInViewport,
        y: newY,
      })
    }, REFRESH_RATE)

    return () => clearInterval(interval)
  }, [currentGameState, currentPieceInViewport, gameOver, onCurrentPieceChange])

  // Hit
  useEffect(() => {
    if (gameOver) return

    const pieceHasHitOtherPieces = checkIfPieceHitsOtherPieces(
      currentPieceInViewport,
      currentGameState,
    )
    if (pieceHasHitOtherPieces) {
      addPieceToGameState(currentPieceInViewport)
    }

    const pieceHitsBottom = checkIfPieceHitsBottom(currentPieceInViewport)
    if (pieceHitsBottom) {
      addPieceToGameState(currentPieceInViewport)
    }
  }, [addPieceToGameState, currentGameState, currentPieceInViewport, gameOver])

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
