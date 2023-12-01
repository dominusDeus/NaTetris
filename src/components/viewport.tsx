import FourPiece from "./pieces/four-piece";
import FourPieceInverted from "./pieces/four-piece-inverted";
import LPiece from "./pieces/l-piece";
import LPieceInverted from "./pieces/l-piece-inverted";
import LinePiece from "./pieces/line";
import Square from "./pieces/square";
import TPiece from "./pieces/t-piece";

const Viewport = () => {
  return (
    <div className="w-[400px] h-[800px] bg-black flex justify-center items-center border-4 border-gray-600 border-solid">
      {/* <LPieceInverted variant="position1" />
      <LPieceInverted variant="position2" />
      <LPieceInverted variant="position3" />
      <LPieceInverted variant="position4" /> */}
      {/* <TPiece variant="position1" />
      <TPiece variant="position2" />
      <TPiece variant="position3" />
      <TPiece variant="position4" /> */}
      {/* <FourPiece variant="position1" />
      <FourPiece variant="position2" />
      <FourPieceInverted variant="position1" />
      <FourPieceInverted variant="position2" /> */}
      {/* <Square variant="position1" /> */}
    </div>
  );
};

export default Viewport;
