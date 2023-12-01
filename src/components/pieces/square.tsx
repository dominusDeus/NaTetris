interface LinePieceProps {
  variant: "position1" | "small";
}

const Square = ({ variant }: LinePieceProps) => {
  return (
    <>
      {variant === "position1" && (
        <div className="flex">
          <div className="flex flex-col">
            <div className="h-10 w-10 bg-purple-300 border border-solid border-gray-500"></div>
            <div className="h-10 w-10 bg-purple-300 border border-solid border-gray-500"></div>
          </div>
          <div className="flex flex-col">
            <div className="h-10 w-10 bg-purple-300 border border-solid border-gray-500"></div>
            <div className="h-10 w-10 bg-purple-300 border border-solid border-gray-500"></div>
          </div>
        </div>
      )}

      {variant === "small" && (
        <div className="flex">
          <div className="flex flex-col">
            <div className="h-6 w-6 bg-purple-300 border border-solid border-gray-500"></div>
            <div className="h-6 w-6 bg-purple-300 border border-solid border-gray-500"></div>
          </div>
          <div className="flex flex-col">
            <div className="h-6 w-6 bg-purple-300 border border-solid border-gray-500"></div>
            <div className="h-6 w-6 bg-purple-300 border border-solid border-gray-500"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default Square;
