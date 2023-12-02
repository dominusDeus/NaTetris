import { Children, ReactNode, useEffect, useState } from "react";
import FourPiece from "./pieces/four-piece";
import FourPieceInverted from "./pieces/four-piece-inverted";
import LPiece from "./pieces/l-piece";
import LPieceInverted from "./pieces/l-piece-inverted";
import LinePiece from "./pieces/line";
import Square from "./pieces/square";
import TPiece from "./pieces/t-piece";
import { twMerge } from "tailwind-merge";

const REFRESH_RATE = 1000;
const PIXEL_SIZE = 40;

interface ViewPortProps {
  currentPiece?: ReactNode;
}

enum Shapes {
  L = "L",
  I = "I",
}

type PieceProps = {
  shape: Shapes;
  x: number;
  y: number;
  rotation: 1 | 2 | 3 | 4;
};

function generateRandomPiece(): PieceProps {
  return {
    rotation: 1,
    shape: Shapes.L,
    x: 0, // TODO: center;
    y: 0,
  };
}

const Viewport = () => {
  const [currentPiece, setCurrentPiece] = useState(() => generateRandomPiece());

  useEffect(() => {
    const interval = setInterval(() => {
      //
    }, REFRESH_RATE);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[400px] h-[800px] bg-black flex justify-center items-center border-4 border-gray-600 border-solid">
      <LPiece
        className={twMerge("absolute")}
        style={{
          top: currentPiece.y * PIXEL_SIZE,
          left: currentPiece.x * PIXEL_SIZE,
        }}
        variant="position1"
      />

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
      {/* <LPiece variant="position1" /> */}
    </div>
  );
};

export default Viewport;
