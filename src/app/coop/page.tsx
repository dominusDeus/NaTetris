"use client"

import { useState } from "react"

import { Box } from "@/components/box"
import ComingPiecesBox, { ComingPieces } from "@/components/coming-pieces-box"
import { VIEWPORT_WIDTH } from "@/components/constants"
import HoldBox from "@/components/hold-box"
import { GamePiece, PieceStructure } from "@/components/types"
import Viewport from "@/components/viewport"
import { generateRandomPiece } from "@/utils/pieces"

function Game() {
  const [currentPieceInViewport, setCurrentPiece] = useState<GamePiece>(() => generateRandomPiece())
  const [comingPieces, setComingPieces] = useState<ComingPieces>(() => ({
    piece1: generateRandomPiece(),
    piece2: generateRandomPiece(),
    piece3: generateRandomPiece(),
  }))
  const [holdBoxPiece, setHoldBoxPiece] = useState<PieceStructure>(
    () => generateRandomPiece().piece,
  )
  const [isSwapable, setSwapable] = useState<boolean>(true)

  const handleNextStepTrigger = () => {
    setCurrentPiece(comingPieces.piece1)
    setComingPieces({
      piece1: comingPieces.piece2,
      piece2: comingPieces.piece3,
      piece3: generateRandomPiece(),
    })
    setSwapable(true)
  }

  return (
    <div className="flex h-full items-center justify-center gap-4">
      <div className="mt-20 self-start">
        <HoldBox holdBoxPiece={holdBoxPiece} />
      </div>
      <Box
        className="box-content flex h-[800px] items-center justify-center border-4 border-solid border-gray-600 bg-black"
        width={VIEWPORT_WIDTH}
      >
        <Viewport
          currentPieceInViewport={currentPieceInViewport}
          onCurrentPieceChange={setCurrentPiece}
          width={VIEWPORT_WIDTH * 2}
          onNextStepTrigger={handleNextStepTrigger}
        />
      </Box>
      <div className="relative mt-20 self-start">
        <ComingPiecesBox pieces={comingPieces} />
      </div>
    </div>
  )
}

export default Game
