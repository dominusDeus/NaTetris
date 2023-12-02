import { useEffect, useState } from "react";
import Piece from "./pieces/l-piece";
import { twMerge } from "tailwind-merge";
import { Atom } from "./pieces/atom";
import { GamePiece, PieceAtom } from "./types";
import { VIEWPORT_HEIGHT, REFRESH_RATE, PIXEL_SIZE, VIEWPORT_WIDTH } from "./constants";
import * as AllFuckingPieces from "./pieces/pieces";

function generateRandomPiece(): GamePiece {
  const asdasd = Object.values(AllFuckingPieces);
  const random = Math.round(Math.random() * 10) % 7;
  return {
    rotation: 1,
    atoms: asdasd[random],
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
  return currentPiece.y === VIEWPORT_HEIGHT - pieceHeight;
}

function checkIfAtomCollidesWithOtherAtoms(atom: PieceAtom, otherAtoms: PieceAtom[]): boolean {
  return otherAtoms.some((currentAtom) => currentAtom.x === atom.x && currentAtom.y === atom.y + 1);
}

function checkIfPieceHitsOtherPieces(
  currentPieceInViewport: GamePiece,
  currentGameState: PieceAtom[],
): boolean {
  return currentPieceInViewport.atoms.some((atom) =>
    checkIfAtomCollidesWithOtherAtoms(
      {
        x: currentPieceInViewport.x + atom.x,
        y: currentPieceInViewport.y + atom.y,
      },
      currentGameState,
    ),
  );
}

const Viewport = () => {
  const [currentPieceInViewport, setCurrentPiece] = useState(() => generateRandomPiece());
  const [currentGameState, setCurrentGameState] = useState<PieceAtom[]>([]);

  useEffect(() => {
    const handleKeydown = (ev: KeyboardEvent) => {
      console.log("EV KEY", ev.key);
      if (ev.key === "ArrowLeft") {
        setCurrentPiece((currentPieceInViewport) => {
          const futureCurrentPieceInViewport: GamePiece = {
            ...currentPieceInViewport,
            x: currentPieceInViewport.x - 1,
          };
          const pieceHasHitOtherPieces = checkIfPieceHitsOtherPieces(
            futureCurrentPieceInViewport,
            currentGameState,
          );
          if (pieceHasHitOtherPieces) return currentPieceInViewport;

          const hasHitBorder = currentPieceInViewport.atoms.some((atom) => {
            const atomNextX = futureCurrentPieceInViewport.x + atom.x;
            return atomNextX < 0;
          });
          if (hasHitBorder) return currentPieceInViewport;

          return {
            ...currentPieceInViewport,
            x: currentPieceInViewport.x - 1,
          };
        });
      } else if (ev.key === "ArrowRight") {
        setCurrentPiece((currentPieceInViewport) => {
          const futureCurrentPieceInViewport: GamePiece = {
            ...currentPieceInViewport,
            x: currentPieceInViewport.x + 1,
          };
          const pieceHasHitOtherPieces = checkIfPieceHitsOtherPieces(
            futureCurrentPieceInViewport,
            currentGameState,
          );
          if (pieceHasHitOtherPieces) return currentPieceInViewport;

          const hasHitBorder = currentPieceInViewport.atoms.some((atom) => {
            const atomNextX = currentPieceInViewport.x + atom.x + 1;
            return atomNextX >= VIEWPORT_WIDTH;
          });
          if (hasHitBorder) return currentPieceInViewport;

          return {
            ...currentPieceInViewport,
            x: currentPieceInViewport.x + 1,
          };
        });
      } else if (ev.key === "ArrowDown") {
        setCurrentPiece((currentPiece) => {
          const bottom = currentPiece.y + getPieceDimensions(currentPiece).height;
          return {
            ...currentPiece,
            y: bottom,
          };
        });
      } else if (ev.key === " ") {
        setCurrentPiece((currentPiece) => {
          const bottom = VIEWPORT_HEIGHT - getPieceDimensions(currentPiece).height;

          return {
            ...currentPiece,
            y: bottom,
          };
        });
      }
      // else if (ev.key === "ArrowDown") {
      //   setCurrentPiece((currentPieceInViewport) => {
      //     const hasHitBorder = currentPieceInViewport.atoms.some((atom) => {
      //       const atomNextX = currentPieceInViewport.x + atom.x + 1;
      //       return atomNextX >= VIEWPORT_WIDTH;
      //     });
      //     if (hasHitBorder) return currentPieceInViewport;

      //     return {
      //       ...currentPieceInViewport,
      //       x: currentPieceInViewport.x + 1,
      //     };
      //   });
      // }
    };

    addEventListener("keydown", handleKeydown);

    return () => removeEventListener("keydown", handleKeydown);
  }, [currentGameState]);

  // Game loop
  useEffect(() => {
    const heightIsFull = currentGameState.some((atom) => atom.y === 0);
    if (heightIsFull) {
      return;
    }

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
  }, [currentGameState]);

  // Hit
  useEffect(() => {
    const pieceHasHitOtherPieces = checkIfPieceHitsOtherPieces(
      currentPieceInViewport,
      currentGameState,
    );
    if (pieceHasHitOtherPieces) {
      // setCurrentGameState
      setCurrentGameState((v) => [
        ...v,
        ...currentPieceInViewport.atoms.map((internalAtomCoords) => ({
          x: currentPieceInViewport.x + internalAtomCoords.x,
          y: currentPieceInViewport.y + internalAtomCoords.y,
        })),
      ]);
      setCurrentPiece(generateRandomPiece());
    } else {
      //
    }

    const pieceHitsBottom = checkIfPieceHitsBottom(currentPieceInViewport);
    if (pieceHitsBottom) {
      setCurrentGameState((v) => [
        ...v,
        ...currentPieceInViewport.atoms.map((internalAtomCoords) => ({
          x: currentPieceInViewport.x + internalAtomCoords.x,
          y: currentPieceInViewport.y + internalAtomCoords.y,
        })),
      ]);
      setCurrentPiece(generateRandomPiece());
    }
  }, [currentGameState, currentPieceInViewport]);

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
