import { CommonProps } from "@/utils/common-props";
import { twMerge } from "tailwind-merge";

interface LinePieceProps extends CommonProps {
  variant: "position1" | "position2" | "position3" | "position4" | "small";
}

const LPiece = ({ className, style, variant }: LinePieceProps) => {
  return (
    <>
      {variant === "position1" && (
        <div className={twMerge("flex flex-col", className)} style={style}>
          <div className="flex">
            <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
          </div>
          <div className="flex">
            <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
            <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
            <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
          </div>
        </div>
      )}

      {variant === "small" && (
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
      )}

      {variant === "position2" && (
        <div className="flex">
          <div className="flex-col">
            <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
            <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
            <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
          </div>
          <div className="flex">
            <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
          </div>
        </div>
      )}
      {variant === "position3" && (
        <div className="flex flex-col">
          <div className="flex">
            <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
            <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
            <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
          </div>
          <div className="flex justify-end">
            <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
          </div>
        </div>
      )}
      {variant === "position4" && (
        <div className="flex">
          <div className="flex items-end">
            <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
          </div>
          <div className="flex-col">
            <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
            <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
            <div className="h-10 w-10 bg-orange-300 border border-solid border-gray-500"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default LPiece;
