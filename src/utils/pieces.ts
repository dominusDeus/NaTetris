import { PIECE_INITIAL_POSITION } from "@/components/constants"
import { GamePiece, PieceStructure } from "@/components/types"

import * as AllPieces from "../components/pieces/pieces"

function x() {
  //TODO: WORK PROBABILITIES
  return Math.round(Math.random() * 10) % 7
}

export function generateRandomPiece(): GamePiece {
  const pieces = Object.values(AllPieces)
  const randomNumber = x()

  return {
    ...PIECE_INITIAL_POSITION,
    piece: { ...pieces[randomNumber] },
  }
}

export function findPieceInitialPosition(piece: PieceStructure) {
  const pieces = Object.values(AllPieces)
  const initialPiece = pieces.find((initialPiece) => initialPiece.color === piece.color)
  if (!initialPiece) {
    return null
  }
  return initialPiece.atoms
}
