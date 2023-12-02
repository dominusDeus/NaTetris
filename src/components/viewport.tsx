import { useEffect, useState } from "react";
import Piece from "./pieces/l-piece";
import { twMerge } from "tailwind-merge";
import { Atom } from "./pieces/atom";
import { GamePiece, PieceAtom } from "./types";
import { VIEWPORT_HEIGHT, REFRESH_RATE, PIXEL_SIZE } from "./constants";
import { L_PIECE_ATOMS } from "./pieces/pieces";

function generateRandomPiece(): GamePiece {
  return {
    rotation: 1,
    atoms: L_PIECE_ATOMS,
    x: 0, // TODO: center;
    y: 0,
  };
}

function checkCollission(a: any, b: any): boolean {
  throw new Error();
}

function getPieceDimensions(piece: GamePiece) {
  return {
    height: 2,
    width: 3,
  };
}

function checkIfPieceHitsBottom(currentPiece: GamePiece): boolean {
  const pieceHeight = getPieceDimensions(currentPiece).height;
  // 2 puntos de alto tiene la L piece
  return currentPiece.y === VIEWPORT_HEIGHT - pieceHeight;
}

const Viewport = () => {
  const [currentPieceInViewport, setCurrentPiece] = useState(() => generateRandomPiece());
  const [currentGameState, setCurrentGameState] = useState<PieceAtom[]>([]);

  console.log(currentPieceInViewport.y);

  useEffect(() => {
    const f = (k: KeyboardEvent) => {};

    addEventListener("keydown", f);

    return () => removeEventListener("keydown", f);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPiece((v) => {
        const newY = v.y + 1;
        return {
          ...v,
          y: newY,
        };
      });
    }, REFRESH_RATE);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // checkCollission(currentPiece, currentGameState);
    /**
     * Check if Y hits 20 (bottom)
     */

    const pieceHitsBottom = checkIfPieceHitsBottom(currentPieceInViewport);
    if (pieceHitsBottom) {
      // add the pieces atoms to the game state
      // 1. identificar x, y de la pieza
      // 2. ancho y largo para saber exactamente
      // 3. update el state del currentGameState

      setCurrentGameState((v) => [
        ...v,
        ...currentPieceInViewport.atoms.map((internalAtomCoords) => ({
          x: currentPieceInViewport.x + internalAtomCoords.x,
          y: currentPieceInViewport.y + internalAtomCoords.y,
        })),
      ]);
      setCurrentPiece(generateRandomPiece());

      // const piecePosition = {x: currentPiece.x, y: currentPiece.y };
      // const pieceDimensions = getPieceDimensions(currentPiece);
      // updateGameState(piecePosition, pieceDimensions)
    } else {
      return;
    }
  }, [currentPieceInViewport]);

  return (
    <div className="relative w-[400px] h-[800px] bg-black flex justify-center items-center border-4 box-content border-gray-600 border-solid">
      <Piece
        atoms={currentPieceInViewport.atoms}
        className={twMerge("absolute")}
        style={{
          top: currentPieceInViewport.y * PIXEL_SIZE,
          left: currentPieceInViewport.x * PIXEL_SIZE,
        }}
        variant="position1"
      />

      {currentGameState.map((atom, i) => (
        <Atom
          className={twMerge("absolute bg-orange-300")}
          key={i}
          style={{
            top: atom.y * PIXEL_SIZE,
            left: atom.x * PIXEL_SIZE,
          }}
        />
      ))}

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
