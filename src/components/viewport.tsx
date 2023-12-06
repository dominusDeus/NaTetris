import { useEffect, useState } from "react";
import Piece from "./pieces/piece";
import { twMerge } from "tailwind-merge";
import { Atom } from "./pieces/atom";
import { GamePiece, PieceAtom } from "./types";
import { VIEWPORT_HEIGHT, REFRESH_RATE, PIXEL_SIZE, VIEWPORT_WIDTH } from "./constants";
import * as AllPieces from "./pieces/pieces";

function generateRandomPiece(): GamePiece {
  const pieces = Object.values(AllPieces);
  const randomNumber = Math.round(Math.random() * 10) % 7;

  return {
    rotation: 1,
    atoms: pieces[randomNumber],
    x: 0, // TODO: center;
    y: 0,
  };
}

function getAtomsDimensions(atoms: PieceAtom[]) {
  const pieceSortedByHeight = atoms.toSorted((a, b) => {
    return a.y > b.y ? -1 : 1;
  });
  const pieceSortedByWidth = atoms.toSorted((a, b) => {
    return a.x > b.x ? -1 : 1;
  });

  return {
    width: pieceSortedByWidth[0].x + 1,
    height: pieceSortedByHeight[0].y + 1,
  };
}

function checkIfPieceHitsBottom(currentPiece: GamePiece): boolean {
  const pieceHeight = getAtomsDimensions(currentPiece.atoms).height;
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

function Viewport() {
  const [gameOver, setGameOver] = useState(false);
  const [currentPieceInViewport, setCurrentPiece] = useState<GamePiece>(() =>
    generateRandomPiece(),
  );
  const [currentGameState, setCurrentGameState] = useState<PieceAtom[]>([]);

  useEffect(() => {
    if (gameOver) return;

    const handleKeydown = (ev: KeyboardEvent) => {
      console.log("EV KEY", ev.key);
      if (ev.key === "ArrowLeft") {
        const futureCurrentPieceInViewport: GamePiece = {
          ...currentPieceInViewport,
          x: currentPieceInViewport.x - 1,
        };
        const pieceHasHitOtherPieces = checkIfPieceHitsOtherPieces(
          futureCurrentPieceInViewport,
          currentGameState,
        );
        if (pieceHasHitOtherPieces) return;

        const hasHitBorder = futureCurrentPieceInViewport.atoms.some((atom) => {
          const atomNextX = futureCurrentPieceInViewport.x + atom.x;
          return atomNextX < 0;
        });
        if (hasHitBorder) return;

        setCurrentPiece(futureCurrentPieceInViewport);
      } else if (ev.key === "ArrowRight") {
        const futureCurrentPieceInViewport: GamePiece = {
          ...currentPieceInViewport,
          x: currentPieceInViewport.x + 1,
        };
        const pieceHasHitOtherPieces = checkIfPieceHitsOtherPieces(
          futureCurrentPieceInViewport,
          currentGameState,
        );
        if (pieceHasHitOtherPieces) return;

        const hasHitBorder = currentPieceInViewport.atoms.some((atom) => {
          const atomNextX = currentPieceInViewport.x + atom.x + 1;
          return atomNextX >= VIEWPORT_WIDTH;
        });
        if (hasHitBorder) return;

        setCurrentPiece(futureCurrentPieceInViewport);
      } else if (ev.key === "ArrowDown") {
        const futureCurrentPieceInViewport: GamePiece = {
          ...currentPieceInViewport,
          y: currentPieceInViewport.y + 1,
        };
        const pieceHasHitOtherPieces = checkIfPieceHitsOtherPieces(
          futureCurrentPieceInViewport,
          currentGameState,
        );
        if (pieceHasHitOtherPieces) return currentPieceInViewport;

        setCurrentPiece(futureCurrentPieceInViewport);
      } else if (ev.key === " ") {
        setCurrentPiece((currentPiece) => {
          const bottom = VIEWPORT_HEIGHT - getAtomsDimensions(currentPiece.atoms).height;

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
  }, [currentGameState, currentPieceInViewport, gameOver]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    console.log(currentGameState);
    const heightIsFull = currentGameState.some((atom) => atom.y === 0);
    if (heightIsFull) {
      console.log("GAME OVER");
      setGameOver(true);
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
  }, [currentGameState, gameOver]);

  // Hit
  useEffect(() => {
    if (gameOver) return;

    const pieceHasHitOtherPieces = checkIfPieceHitsOtherPieces(
      currentPieceInViewport,
      currentGameState,
    );
    if (pieceHasHitOtherPieces) {
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
    </div>
  );
}

export default Viewport;
