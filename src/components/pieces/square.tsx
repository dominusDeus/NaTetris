interface LinePieceProps {
  variant: "position1" | "small"
}

const Square = ({ variant }: LinePieceProps) => {
  return (
    <>
      {variant === "position1" && (
        <div className="flex">
          <div className="flex flex-col">
            <div className="h-10 w-10 border border-solid border-gray-500 bg-purple-300"></div>
            <div className="h-10 w-10 border border-solid border-gray-500 bg-purple-300"></div>
          </div>
          <div className="flex flex-col">
            <div className="h-10 w-10 border border-solid border-gray-500 bg-purple-300"></div>
            <div className="h-10 w-10 border border-solid border-gray-500 bg-purple-300"></div>
          </div>
        </div>
      )}

      {variant === "small" && (
        <div className="flex">
          <div className="flex flex-col">
            <div className="h-6 w-6 border border-solid border-gray-500 bg-purple-300"></div>
            <div className="h-6 w-6 border border-solid border-gray-500 bg-purple-300"></div>
          </div>
          <div className="flex flex-col">
            <div className="h-6 w-6 border border-solid border-gray-500 bg-purple-300"></div>
            <div className="h-6 w-6 border border-solid border-gray-500 bg-purple-300"></div>
          </div>
        </div>
      )}
    </>
  )
}

export default Square
