import { VIEWPORT_HEIGHT } from "../components/constants"
import { GamePiece, PieceAtom } from "../components/types"

export function getAtomsDimensions(atoms: PieceAtom[]) {
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

export function checkIfPieceHitsBottom(piece: GamePiece): boolean {
  const pieceHeight = getAtomsDimensions(piece.piece.atoms).height
  return piece.coords.y + pieceHeight === VIEWPORT_HEIGHT
}

export function checkIfPieceHitsLeftBorder(piece: GamePiece) {
  return piece.coords.x === 0
}

export function checkIfPieceHitsRightBorder(piece: GamePiece, width: number) {
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
export function checkIfPieceHitsOtherPieces(
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
export function rotateAtomsToTheRight(atoms: PieceAtom[]) {
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

export function removeCompletedLines(gameState: PieceAtom[], width: number): PieceAtom[] {
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
