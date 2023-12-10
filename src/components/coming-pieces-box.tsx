import { twMerge } from "tailwind-merge";
import Piece from "./pieces/piece";
import { I_PIECE_ATOMS, L_PIECE_ATOMS, O_PIECE_ATOMS } from "./pieces/pieces";
import { GamePiece } from "./types";

interface ComingPiecesBoxProps {
  pieces: ComingPieces;
}

export interface ComingPieces {
  piece1: GamePiece;
  piece2: GamePiece;
  piece3: GamePiece;
}

const ComingPiecesBox = ({ pieces }: ComingPiecesBoxProps) => {
  return (
    <div className="relative h-[380px] bg-black w-[200px] flex flex-col items-center gap-4 border-4 border-gray-600 border-solid">
      <p className="text-gray-300 py-5 text-2xl text-center">NEXT</p>
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
  );
};

export default ComingPiecesBox;
