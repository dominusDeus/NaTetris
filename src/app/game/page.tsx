"use client"

import { useState } from "react"

import { Box } from "@/components/box"
import ComingPiecesBox, { ComingPieces } from "@/components/coming-pieces-box"
import { PIECE_INITIAL_POSITION } from "@/components/constants"
import { VIEWPORT_WIDTH } from "@/components/constants"
import HoldBox from "@/components/hold-box"
import Piece from "@/components/pieces/piece"
import { GamePiece, PieceStructure } from "@/components/types"
import Viewport from "@/components/viewport"
import { findPieceInitialPosition, generateRandomPiece } from "@/utils/pieces"
import { tw } from "@/utils/tw"

function Game() {
  const [currentPieceInViewport, setCurrentPiece] = useState<GamePiece>(() => generateRandomPiece())
  const [holdBoxPiece, setHoldBoxPiece] = useState<PieceStructure>(() => ({
    ...generateRandomPiece().piece,
    isSwapable: true,
  }))
  const [comingPieces, setComingPieces] = useState<ComingPieces>(() => ({
    piece1: generateRandomPiece(),
    piece2: generateRandomPiece(),
    piece3: generateRandomPiece(),
  }))
  const [isSwapable, setSwapable] = useState<boolean>(true)

  const handleHoldBoxSwap = () => {
    if (isSwapable) {
      setCurrentPiece({
        ...PIECE_INITIAL_POSITION,
        piece: { atoms: holdBoxPiece.atoms, color: holdBoxPiece.color },
      })
      const holdBoxPieceInitialPosition = findPieceInitialPosition(currentPieceInViewport.piece)
      if (!holdBoxPieceInitialPosition) {
        throw new Error("No pieces found matching the one passed by paramater")
      }
      setHoldBoxPiece({
        color: currentPieceInViewport.piece.color,
        atoms: holdBoxPieceInitialPosition,
      })
    }
    setSwapable(false)
  }

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
          onHoldBoxClick={handleHoldBoxSwap}
          onNextStepTrigger={handleNextStepTrigger}
          width={VIEWPORT_WIDTH}
        >
          <Box.Place {...currentPieceInViewport.coords}>
            <Piece
              atoms={currentPieceInViewport.piece.atoms}
              className={tw("z-50")}
              color={currentPieceInViewport.piece.color}
            />
          </Box.Place>
        </Viewport>
      </Box>
      <div className="relative mt-20 self-start">
        <ComingPiecesBox pieces={comingPieces} />
      </div>
    </div>
  )
}

export default Game
