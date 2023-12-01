import ComingPiecesBox from "@/components/coming-pieces-box";
import HoldBox from "@/components/hold-box";
import Viewport from "@/components/viewport";

const Game = () => {
  return (
    <div className="flex items-center justify-center h-full gap-4">
      <div className="self-start mt-20">
        <HoldBox />
      </div>
      <Viewport />
      <div className="self-start mt-20">
        <ComingPiecesBox />
      </div>
    </div>
  );
};

export default Game;
