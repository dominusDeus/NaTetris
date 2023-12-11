"use client"

import ComingPiecesBox, { ComingPieces } from "@/components/coming-pieces-box"
import HoldBox from "@/components/hold-box"
import { GamePiece } from "@/components/types"
import Viewport from "@/components/viewport"
import { generateRandomPiece } from "@/utils/pieces"
import { useState } from "react"

const Game = () => {
  const [currentPieceInViewport, setCurrentPiece] = useState<GamePiece>(() => generateRandomPiece())
  const [comingPieces, setComingPieces] = useState<ComingPieces>(() => ({
    piece1: generateRandomPiece(),
    piece2: generateRandomPiece(),
    piece3: generateRandomPiece(),
  }))
  const [holdBoxPiece, setHoldBoxPiece] = useState<GamePiece>(() => generateRandomPiece())

  return (
    <div className="flex h-full items-center justify-center gap-4">
      <div className="mt-20 self-start">
        <HoldBox />
      </div>
      <Viewport
        comingPieces={comingPieces}
        currentPieceInViewport={currentPieceInViewport}
        onComingPiecesChange={setComingPieces}
        onCurrentPieceChange={setCurrentPiece}
      />
      <div className="relative mt-20 self-start">
        <ComingPiecesBox pieces={comingPieces} />
      </div>
    </div>
  )
}

export default Game
