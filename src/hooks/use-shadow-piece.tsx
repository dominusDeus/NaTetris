import { useMemo } from "react"

import { VIEWPORT_HEIGHT } from "../components/constants"
import { GamePiece, PieceAtom } from "../components/types"
import { checkIfPieceHitsBottom, checkIfPieceHitsOtherPieces } from "../utils/atom-utils"

type UseShadowPieceProps = {
  piece: GamePiece
  gameAtoms: PieceAtom[]
}

export function useShadowPiece({ piece, gameAtoms }: UseShadowPieceProps): GamePiece {
  const shadowPiece = useMemo(() => {
    for (let i = piece.coords.y + 1; i <= VIEWPORT_HEIGHT; i++) {
      const futureCurrentPieceInViewport = {
        ...piece,
        coords: {
          ...piece.coords,
          y: i,
        },
      }

      const futurePieceHitsOtherPieces =
        checkIfPieceHitsOtherPieces(
          {
            ...futureCurrentPieceInViewport,
            coords: {
              ...futureCurrentPieceInViewport.coords,
              y: futureCurrentPieceInViewport.coords.y + 1,
            },
          },
          gameAtoms,
        ) || checkIfPieceHitsBottom(futureCurrentPieceInViewport)

      if (futurePieceHitsOtherPieces) {
        return {
          ...futureCurrentPieceInViewport,
          piece: {
            ...futureCurrentPieceInViewport.piece,
            color: "#000",
          },
        }
      }
    }
  }, [gameAtoms, piece])

  if (!shadowPiece) {
    throw new Error("Should not happen")
  }

  return shadowPiece
}
