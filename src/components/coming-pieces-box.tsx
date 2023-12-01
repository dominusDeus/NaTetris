import FourPieceInverted from "./pieces/four-piece-inverted";
import LPiece from "./pieces/l-piece";
import TPiece from "./pieces/t-piece";

const ComingPiecesBox = () => {
  return (
    <div className="h-[380px] bg-black w-[200px] flex flex-col items-center gap-8 border-4 border-gray-600 border-solid">
      <p className="text-gray-300 py-5 text-2xl">NEXT</p>
      <FourPieceInverted variant="small" />
      <LPiece variant="small" />
      <TPiece variant="small" />
    </div>
  );
};

export default ComingPiecesBox;
