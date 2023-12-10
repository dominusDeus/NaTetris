import Piece from "@/components/pieces/piece";
import { useEffect } from "react";

interface useGameStore {
  currentPiece: JSX.Element;
}

export const useGame = (): useGameStore => {
  useEffect(() => {}, []);

  return {
    currentPiece: <Piece variant="position1" atoms={[]} />,
  };
};
