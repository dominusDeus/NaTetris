import { CommonProps } from "@/utils/common-props"
import { twMerge } from "tailwind-merge"
import { Atom } from "./atom"
import { Dimensions, PieceAtom } from "../types"
import { PIXEL_SIZE } from "../constants"

interface PieceProps extends CommonProps {
  atoms: PieceAtom[]
  variant?: "position1" | "position2" | "position3" | "position4" | "small"
  color: string
}

function getAtomsDimensions(atoms: PieceAtom[]): Dimensions {
  return {
    height: atoms.toSorted((a, b) => (a.y > b.y ? -1 : 1))[0].y + 1,
    width: atoms.toSorted((a, b) => (a.x > b.x ? -1 : 1))[0].x + 1,
  }
}

export function Piece({ className, style, variant, atoms, color }: PieceProps) {
  if (variant === "small") {
    return (
      <div className="flex flex-col">
        <div className="flex">
          <div className="h-6 w-6 border border-solid border-gray-500 bg-orange-300"></div>
        </div>
        <div className="flex">
          <div className="h-6 w-6 border border-solid border-gray-500 bg-orange-300"></div>
          <div className="h-6 w-6 border border-solid border-gray-500 bg-orange-300"></div>
          <div className="h-6 w-6 border border-solid border-gray-500 bg-orange-300"></div>
        </div>
      </div>
    )
  }

  const { height, width } = getAtomsDimensions(atoms)

  return (
    <div
      className={twMerge(className)}
      style={{
        minHeight: height * PIXEL_SIZE,
        minWidth: width * PIXEL_SIZE,
        ...style,
      }}
    >
      <div className="relative">
        {atoms.map((atom, i) => (
          <Atom
            className="absolute"
            key={i}
            style={{
              backgroundColor: color,
              top: atom.y * PIXEL_SIZE,
              left: atom.x * PIXEL_SIZE,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Piece
