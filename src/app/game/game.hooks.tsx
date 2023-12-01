import LPiece from "@/components/pieces/l-piece";
import { useEffect } from "react";

interface useGameStore {
  currentPiece: JSX.Element;
}

export const useGame = (): useGameStore => {
  useEffect(() => {}, []);

  return {
    currentPiece: <LPiece variant="position1" />,
  };
};
