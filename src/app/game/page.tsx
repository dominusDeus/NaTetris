"use client";

import ComingPiecesBox, { ComingPieces } from "@/components/coming-pieces-box";
import HoldBox from "@/components/hold-box";
import { GamePiece } from "@/components/types";
import Viewport from "@/components/viewport";
import { generateRandomPiece } from "@/utils/pieces";
import { useState } from "react";

const Game = () => {
  const [currentPieceInViewport, setCurrentPiece] = useState<GamePiece>(() =>
    generateRandomPiece()
  );
  const [comingPieces, setComingPieces] = useState<ComingPieces>(() => ({
    piece1: generateRandomPiece(),
    piece2: generateRandomPiece(),
    piece3: generateRandomPiece(),
  }));
  const [holdBoxPiece, setHoldBoxPiece] = useState<GamePiece>(() =>
    generateRandomPiece()
  );

  return (
    <div className="flex items-center justify-center h-full gap-4">
      <div className="self-start mt-20">
        <HoldBox />
      </div>
      <Viewport
        currentPieceInViewport={currentPieceInViewport}
        setCurrentPiece={setCurrentPiece}
        comingPieces={comingPieces}
        setComingPieces={setComingPieces}
      />
      <div className="relative self-start mt-20">
        <ComingPiecesBox pieces={comingPieces} />
      </div>
    </div>
  );
};

export default Game;
