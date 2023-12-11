import Piece from "./pieces/piece"
import { I_PIECE_ATOMS } from "./pieces/pieces"
import { twMerge } from "tailwind-merge"

const HoldBox = () => {
  return (
    <div className="flex h-[160px] w-[200px] flex-col items-center gap-6 border-4 border-solid border-gray-600 bg-black">
      <p className="py-5 text-2xl text-gray-300">HOLD</p>
      <Piece
        atoms={I_PIECE_ATOMS.atoms}
        className={twMerge("scale-75")}
        color={I_PIECE_ATOMS.color}
      />
    </div>
  )
}

export default HoldBox
