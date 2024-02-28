import Piece from "./pieces/piece"
import { twMerge } from "tailwind-merge"
import { PieceStructure } from "./types"

interface HoldBoxProps {
  holdBoxPiece: PieceStructure
}

const HoldBox = ({ holdBoxPiece }: HoldBoxProps) => {
  return (
    <div className="flex h-[160px] w-[200px] flex-col items-center gap-6 border-4 border-solid border-gray-600 bg-black">
      <p className="py-5 text-2xl text-gray-300">HOLD</p>
      <Piece
        atoms={holdBoxPiece.atoms}
        className={twMerge("scale-75")}
        color={holdBoxPiece.color}
      />
    </div>
  )
}

export default HoldBox
