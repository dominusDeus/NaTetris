export type Coords = {
  x: number
  y: number
}

export type Dimensions = {
  height: number
  width: number
}

export type PieceStructure = {
  color: string
  atoms: PieceAtom[]
}

export type PieceAtom = Coords & {}

export type GamePiece = Coords & {
  piece: PieceStructure
  rotation: 1 | 2 | 3 | 4
}
