import { z } from "zod"

const CoordSchema = z.object({
  x: z.number(),
  y: z.number(),
})

const PieceStructureSchema = z.object({
  color: z.string(),
  atoms: z.array(CoordSchema),
})

export const GamePieceSchema = z.object({
  coords: CoordSchema,
  piece: PieceStructureSchema,
})

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

export type GamePiece = {
  coords: Coords
  piece: PieceStructure
}
