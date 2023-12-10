interface LinePieceProps {
  variant: "position1" | "position2" | "small"
}

const FourPieceInverted = ({ variant }: LinePieceProps) => {
  return (
    <>
      {variant === "position1" && (
        <div className="flex">
          <div className="flex flex-col pt-10">
            <div className="h-10 w-10 border border-solid border-gray-500 bg-gray-300"></div>
            <div className="h-10 w-10 border border-solid border-gray-500 bg-gray-300"></div>
          </div>
          <div className="flex flex-col pb-10">
            <div className="h-10 w-10 border border-solid border-gray-500 bg-gray-300"></div>
            <div className="h-10 w-10 border border-solid border-gray-500 bg-gray-300"></div>
          </div>
        </div>
      )}
      {variant === "position2" && (
        <div className="flex-col">
          <div className="flex pr-10">
            <div className="h-10 w-10 border border-solid border-gray-500 bg-gray-300"></div>
            <div className="h-10 w-10 border border-solid border-gray-500 bg-gray-300"></div>
          </div>
          <div className="flex pl-10">
            <div className="h-10 w-10 border border-solid border-gray-500 bg-gray-300"></div>
            <div className="h-10 w-10 border border-solid border-gray-500 bg-gray-300"></div>
          </div>
        </div>
      )}
      {variant === "small" && (
        <div className="flex-col">
          <div className="flex pr-6">
            <div className="h-6 w-6 border border-solid border-gray-500 bg-gray-300"></div>
            <div className="h-6 w-6 border border-solid border-gray-500 bg-gray-300"></div>
          </div>
          <div className="flex pl-6">
            <div className="h-6 w-6 border border-solid border-gray-500 bg-gray-300"></div>
            <div className="h-6 w-6 border border-solid border-gray-500 bg-gray-300"></div>
          </div>
        </div>
      )}
    </>
  )
}

export default FourPieceInverted
