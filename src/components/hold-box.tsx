import { twMerge } from "tailwind-merge"

import Piece from "./pieces/piece"
import { PieceStructure } from "./types"

interface HoldBoxProps {
  holdBoxPiece: PieceStructure
}

const HoldBox = ({ holdBoxPiece }: HoldBoxProps) => {
  return (
    <div className=" flex h-[160px] w-[200px] flex-col items-center border-4 border-solid border-gray-600 bg-black p-2">
      <div className="flex h-full flex-col items-center justify-between">
        <p className="py-2 text-2xl text-gray-300">HOLD</p>
        <Piece
          atoms={holdBoxPiece.atoms}
          className={twMerge("scale-[0.65]")}
          color={holdBoxPiece.color}
        />
      </div>
    </div>
  )
}

export default HoldBox
