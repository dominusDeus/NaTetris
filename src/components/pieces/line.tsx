interface LinePieceProps {
  variant: "position1" | "position2" | "small";
}

const LinePiece = ({ variant }: LinePieceProps) => {
  return (
    <>
      {variant === "position1" && (
        <div className="flex flex-col">
          <div className="h-10 w-10 bg-blue-300 border border-solid border-gray-500"></div>
          <div className="h-10 w-10 bg-blue-300 border border-solid border-gray-500"></div>
          <div className="h-10 w-10 bg-blue-300 border border-solid border-gray-500"></div>
          <div className="h-10 w-10 bg-blue-300 border border-solid border-gray-500"></div>
        </div>
      )}

      {variant === "position2" && (
        <div className="flex">
          <div className="h-10 w-10 bg-blue-300 border border-solid border-gray-500"></div>
          <div className="h-10 w-10 bg-blue-300 border border-solid border-gray-500"></div>
          <div className="h-10 w-10 bg-blue-300 border border-solid border-gray-500"></div>
          <div className="h-10 w-10 bg-blue-300 border border-solid border-gray-500"></div>
        </div>
      )}

      {variant === "small" && (
        <div className="flex">
          <div className="h-6 w-6 bg-blue-300 border border-solid border-gray-500"></div>
          <div className="h-6 w-6 bg-blue-300 border border-solid border-gray-500"></div>
          <div className="h-6 w-6 bg-blue-300 border border-solid border-gray-500"></div>
          <div className="h-6 w-6 bg-blue-300 border border-solid border-gray-500"></div>
        </div>
      )}
    </>
  );
};

export default LinePiece;
