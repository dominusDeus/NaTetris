import { GamePiece } from "@/components/types";
import * as AllPieces from "../components/pieces/pieces";

export function generateRandomPiece(): GamePiece {
  const pieces = Object.values(AllPieces);
  const randomNumber = Math.round(Math.random() * 10) % 7;

  return {
    rotation: 1,
    piece: pieces[randomNumber],
    x: 0, // TODO: center;
    y: 0,
  };
}
