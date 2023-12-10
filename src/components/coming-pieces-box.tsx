import { twMerge } from "tailwind-merge";
import Piece from "./pieces/piece";
import { I_PIECE_ATOMS, L_PIECE_ATOMS, O_PIECE_ATOMS } from "./pieces/pieces";

const ComingPiecesBox = () => {
  return (
    <div className="relative h-[380px] bg-black w-[200px] flex flex-col gap-8 border-4 border-gray-600 border-solid">
      <p className="text-gray-300 py-5 text-2xl text-center">NEXT</p>
      <Piece
        atoms={I_PIECE_ATOMS.atoms}
        className={twMerge("scale-75")}
        color={I_PIECE_ATOMS.color}
      />
      <Piece
        atoms={L_PIECE_ATOMS.atoms}
        className={twMerge("scale-75")}
        color={L_PIECE_ATOMS.color}
      />
      <Piece
        atoms={O_PIECE_ATOMS.atoms}
        className={twMerge("scale-75")}
        color={O_PIECE_ATOMS.color}
      />
    </div>
  );
};

export default ComingPiecesBox;
