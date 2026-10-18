import { Composition } from "remotion";
import { Rodoslovnaya } from "./Rodoslovnaya";
import { FPS, HEIGHT, TOTAL_SEC, WIDTH } from "./timeline";

// id "rodoslovnaya" → `npx remotion render` пишет в out/rodoslovnaya.mp4
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="rodoslovnaya"
      component={Rodoslovnaya}
      durationInFrames={Math.round(TOTAL_SEC * FPS)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
