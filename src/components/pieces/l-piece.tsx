import { CommonProps } from "@/utils/common-props";
import { twMerge } from "tailwind-merge";
import { Atom } from "./atom";
import { Dimensions, PieceAtom } from "../types";
import { PIXEL_SIZE } from "../constants";

interface PieceProps extends CommonProps {
  atoms: PieceAtom[];
  variant?: "position1" | "position2" | "position3" | "position4" | "small";
}

function getAtomsDimensions(atoms: PieceAtom[]): Dimensions {
  return {
    height: atoms.sort((a, b) => (a.y > b.y ? -1 : 1))[0].y + 1,
    width: atoms.sort((a, b) => (a.x > b.x ? -1 : 1))[0].x + 1,
  };
}

const Piece = ({ className, style, variant, atoms }: PieceProps) => {
  if (variant === "small") {
    return (
      <div className="flex flex-col">
        <div className="flex">
          <div className="h-6 w-6 bg-orange-300 border border-solid border-gray-500"></div>
        </div>
        <div className="flex">
          <div className="h-6 w-6 bg-orange-300 border border-solid border-gray-500"></div>
          <div className="h-6 w-6 bg-orange-300 border border-solid border-gray-500"></div>
          <div className="h-6 w-6 bg-orange-300 border border-solid border-gray-500"></div>
        </div>
      </div>
    );
  }

  const { height } = getAtomsDimensions(atoms);

  return (
    <div className={twMerge(className)} style={{ minHeight: height * PIXEL_SIZE, ...style }}>
      <div className="relative">
        {atoms.map((atom, i) => (
          <Atom
            className="absolute bg-orange-300"
            key={i}
            style={{
              top: atom.y * PIXEL_SIZE,
              left: atom.x * PIXEL_SIZE,
            }}
          />
        ))}
      </div>
    </div>
  );

  // return (
  //   <>
  //     {variant === "position1" && (
  //       <div className={twMerge("flex flex-col", className)} style={style}>
  //         <div className="flex">
  //           <Atom />
  //         </div>
  //         <div className="flex">
  //           <Atom />
  //           <Atom />
  //           <Atom />
  //         </div>
  //       </div>
  //     )}

  //     {variant === "small" && (

  //     )}

  //     {variant === "position2" && (
  //       <div className="flex">
  //         <div className="flex-col">
  //           <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
  //           <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
  //           <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
  //         </div>
  //         <div className="flex">
  //           <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
  //         </div>
  //       </div>
  //     )}
  //     {variant === "position3" && (
  //       <div className="flex flex-col">
  //         <div className="flex">
  //           <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
  //           <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
  //           <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
  //         </div>
  //         <div className="flex justify-end">
  //           <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
  //         </div>
  //       </div>
  //     )}
  //     {variant === "position4" && (
  //       <div className="flex">
  //         <div className="flex items-end">
  //           <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
  //         </div>
  //         <div className="flex-col">
  //           <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
  //           <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
  //           <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
  //         </div>
  //       </div>
  //     )}
  //   </>
  // );
};

export default Piece;
