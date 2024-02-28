import { GamePiece } from "@/components/types"
import * as AllPieces from "../components/pieces/pieces"
import { PIECE_INITIAL_POSITION } from "@/components/constants"

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
