import { PieceStructure } from "../types"

export const L_PIECE_ATOMS: PieceStructure = {
  atoms: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  color: "rgb(253 186 116)",
}

export const L_INVERTED_PIECE_ATOMS: PieceStructure = {
  atoms: [
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 2, y: 0 },
  ],
  color: "rgb(134 239 172)",
}

export const O_PIECE_ATOMS: PieceStructure = {
  atoms: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
  ],
  color: "rgb(216 180 254)",
}

export const I_PIECE_ATOMS: PieceStructure = {
  atoms: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
  ],
  color: "rgb(147 197 253)",
}

export const T_PIECE_ATOMS: PieceStructure = {
  atoms: [
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 1, y: 0 },
  ],
  color: "rgb(252 165 165)",
}

export const Z_PIECE_ATOMS: PieceStructure = {
  atoms: [
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  color: "rgb(253 224 71)",
}

export const Z_INVERTED_PIECE_ATOMS: PieceStructure = {
  atoms: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  color: "rgb(209 213 219)",
}
