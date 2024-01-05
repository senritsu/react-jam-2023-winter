import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useMemo, Suspense, useRef } from "react";
import { Color, CubicBezierCurve3, Vector3 } from "three";
import { Action } from "./Action";
import { Lights } from "./Lights";
import { Camera } from "./Camera";
import { useSound } from "./SceneContent.useSound.ts";
import { GameState } from "../../logic.types.ts";

export const SceneContents = ({
  game,
  yourPlayerId,
}: {
  game: GameState;
  yourPlayerId?: string;
}) => {
  const playerPosition = useRef(new Vector3());

  const curve = useMemo(
    () =>
      new CubicBezierCurve3(
        ...game.segments[game.currentSegmentId].curveParameters.map(
          (x) => new Vector3(...x)
        )
      ),
    [game.currentSegmentId, game.segments]
  );

  const { scene } = useThree();
  const color = useMemo(
    () => new Color(game.currentLevelBackground),
    [game.currentLevelBackground]
  );

  useSound(game);

  useFrame(() => {
    curve.getPointAt(
      game.currentSegmentDistance / game.segments[game.currentSegmentId].length,
      playerPosition.current
    );

    if (scene.background instanceof Color) {
      scene.background.lerp(color, 0.05);
      scene.fog?.color.set(scene.background);
    }
  });

  return (
    <>
      <Lights />
      <Camera playerPosition={playerPosition} />
      <Action
        game={game}
        yourPlayerId={yourPlayerId}
        playerPosition={playerPosition}
      />
      <Suspense fallback={null}>
        <EffectComposer>
          <Bloom luminanceThreshold={1} />
        </EffectComposer>
      </Suspense>
    </>
  );
};
