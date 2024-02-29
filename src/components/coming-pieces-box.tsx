import { twMerge } from "tailwind-merge"

import Piece from "./pieces/piece"
import { GamePiece } from "./types"

interface ComingPiecesBoxProps {
  pieces: ComingPieces
}

export interface ComingPieces {
  piece1: GamePiece
  piece2: GamePiece
  piece3: GamePiece
}

const ComingPiecesBox = ({ pieces }: ComingPiecesBoxProps) => {
  return (
    <div className="relative flex h-[380px] w-[200px] flex-col items-center gap-4 border-4 border-solid border-gray-600 bg-black">
      <p className="py-5 text-center text-2xl text-gray-300">NEXT</p>
      <Piece
        atoms={pieces.piece1.piece.atoms}
        className={twMerge("scale-75")}
        color={pieces.piece1.piece.color}
      />
      <Piece
        atoms={pieces.piece2.piece.atoms}
        className={twMerge("scale-75")}
        color={pieces.piece2.piece.color}
      />
      <Piece
        atoms={pieces.piece3.piece.atoms}
        className={twMerge("scale-75")}
        color={pieces.piece3.piece.color}
      />
    </div>
  )
}

export default ComingPiecesBox
