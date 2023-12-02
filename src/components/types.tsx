type Coords = {
  x: number;
  y: number;
};

export type Dimensions = {
  height: number;
  width: number;
};

export type PieceAtom = Coords & {};

export type GamePiece = Coords & {
  atoms: PieceAtom[];
  rotation: 1 | 2 | 3 | 4;
};
