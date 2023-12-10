import FourPieceInverted from "./pieces/four-piece-inverted";
import Piece from "./pieces/piece";
import LinePiece from "./pieces/line";
import { I_PIECE_ATOMS } from "./pieces/pieces";
import { twMerge } from "tailwind-merge";

const HoldBox = () => {
  return (
    <div className="h-[160px] bg-black w-[200px] flex flex-col items-center gap-6 border-4 border-gray-600 border-solid">
      <p className="text-gray-300 py-5 text-2xl">HOLD</p>
      <Piece
        atoms={I_PIECE_ATOMS.atoms}
        className={twMerge("scale-75")}
        color={I_PIECE_ATOMS.color}
      />
    </div>
  );
};

export default HoldBox;
