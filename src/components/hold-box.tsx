import FourPieceInverted from "./pieces/four-piece-inverted";
import LPiece from "./pieces/l-piece";
import LinePiece from "./pieces/line";

const HoldBox = () => {
  return (
    <div className="h-[160px] bg-black w-[200px] flex flex-col items-center gap-8 border-4 border-gray-600 border-solid">
      <p className="text-gray-300 py-5 text-2xl">HOLD</p>
      <LinePiece variant="small" />
    </div>
  );
};

export default HoldBox;
