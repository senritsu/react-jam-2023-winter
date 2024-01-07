import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense } from "react";
import { Lights } from "./Lights";
import { Camera } from "./Camera";
import {
  useActivePlayerChangeSound,
  useCalloutSounds,
  useDynamicBgm,
  useIncreasingBpm,
  useLevelChangeSound,
} from "./SceneContent.useSound.ts";
import { usePlayerPosition } from "./usePlayerPosition.ts";
import { GameOverSound } from "./GameOverSound.tsx";
import { PlayerMarker } from "./PlayerMarker.tsx";
import { Level } from "./Level.tsx";
import { Enemies } from "./Enemies.tsx";

export const SceneContents = () => {
  useDynamicBgm();
  useLevelChangeSound();
  useActivePlayerChangeSound();
  useCalloutSounds();
  useIncreasingBpm();

  const playerPosition = usePlayerPosition();

  return (
    <>
      <Lights />
      <Camera playerPosition={playerPosition} />

      <GameOverSound />

      <Level />
      <PlayerMarker playerPosition={playerPosition} />
      <Enemies playerPosition={playerPosition} />

      <Suspense fallback={null}>
        <EffectComposer>
          <Bloom luminanceThreshold={1} />
        </EffectComposer>
      </Suspense>
    </>
  );
};
