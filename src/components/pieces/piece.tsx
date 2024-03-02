import { twMerge } from "tailwind-merge"

import { CommonProps } from "@/utils/common-props"

import { ATOM_SIZE } from "../constants"
import { Dimensions, PieceAtom } from "../types"
import { Atom } from "./atom"

interface PieceProps extends CommonProps {
  atoms: PieceAtom[]
  color: string
}

function getAtomsDimensions(atoms: PieceAtom[]): Dimensions {
  return {
    height: atoms.toSorted((a, b) => (a.y > b.y ? -1 : 1))[0].y + 1,
    width: atoms.toSorted((a, b) => (a.x > b.x ? -1 : 1))[0].x + 1,
  }
}

export function Piece({ className, style, atoms, color }: PieceProps) {
  const { height, width } = getAtomsDimensions(atoms)

  return (
    <div
      className={twMerge(className)}
      style={{
        minHeight: height * ATOM_SIZE,
        minWidth: width * ATOM_SIZE,
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
              top: atom.y * ATOM_SIZE,
              left: atom.x * ATOM_SIZE,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Piece
