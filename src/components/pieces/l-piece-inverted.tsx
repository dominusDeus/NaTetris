interface LinePieceProps {
  variant: "position1" | "position2" | "position3" | "position4" | "small"
}

const LPieceInverted = ({ variant }: LinePieceProps) => {
  return (
    <>
      {variant === "position1" && (
        <div className="flex flex-col">
          <div className="flex justify-end">
            <div className="h-10 w-10 border border-solid border-gray-500 bg-green-300"></div>
          </div>
          <div className="flex">
            <div className="h-10 w-10 border border-solid border-gray-500 bg-green-300"></div>
            <div className="h-10 w-10 border border-solid border-gray-500 bg-green-300"></div>
            <div className="h-10 w-10 border border-solid border-gray-500 bg-green-300"></div>
          </div>
        </div>
      )}

      {variant === "small" && (
        <div className="flex flex-col">
          <div className="flex justify-end">
            <div className="h-6 w-6 border border-solid border-gray-500 bg-green-300"></div>
          </div>
          <div className="flex">
            <div className="h-6 w-6 border border-solid border-gray-500 bg-green-300"></div>
            <div className="h-6 w-6 border border-solid border-gray-500 bg-green-300"></div>
            <div className="h-6 w-6 border border-solid border-gray-500 bg-green-300"></div>
          </div>
        </div>
      )}

      {variant === "position2" && (
        <div className="flex">
          <div className="flex-col">
            <div className="h-10 w-10 border border-solid border-gray-500 bg-green-300"></div>
            <div className="h-10 w-10 border border-solid border-gray-500 bg-green-300"></div>
            <div className="h-10 w-10 border border-solid border-gray-500 bg-green-300"></div>
          </div>
          <div className="flex items-end">
            <div className="h-10 w-10 border border-solid border-gray-500 bg-green-300"></div>
          </div>
        </div>
      )}
      {variant === "position3" && (
        <div className="flex flex-col">
          <div className="flex">
            <div className="h-10 w-10 border border-solid border-gray-500 bg-green-300"></div>
            <div className="h-10 w-10 border border-solid border-gray-500 bg-green-300"></div>
            <div className="h-10 w-10 border border-solid border-gray-500 bg-green-300"></div>
          </div>
          <div className="flex">
            <div className="h-10 w-10 border border-solid border-gray-500 bg-green-300"></div>
          </div>
        </div>
      )}
      {variant === "position4" && (
        <div className="flex">
          <div className="flex">
            <div className="h-10 w-10 border border-solid border-gray-500 bg-green-300"></div>
          </div>
          <div className="flex-col">
            <div className="h-10 w-10 border border-solid border-gray-500 bg-green-300"></div>
            <div className="h-10 w-10 border border-solid border-gray-500 bg-green-300"></div>
            <div className="h-10 w-10 border border-solid border-gray-500 bg-green-300"></div>
          </div>
        </div>
      )}
    </>
  )
}

export default LPieceInverted
