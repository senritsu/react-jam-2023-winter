import { useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useMemo, Suspense, useRef } from "react";
import { CubicBezierCurve3, Vector3 } from "three";
import { Action } from "./Action";
import { Lights } from "./Lights";
import { Camera } from "./Camera";
import { GameState } from "../logic";

export const SceneContents = ({
  game,
  yourPlayerId,
}: {
  game: GameState;
  yourPlayerId?: string;
}) => {
  const playerPosition = useRef(new Vector3());

  const reconstructedSegments = useMemo(
    () =>
      game.segments.map(({ curve, owner }) => ({
        curve: new CubicBezierCurve3(curve.v0, curve.v1, curve.v2, curve.v3),
        owner,
      })),
    [game.segments]
  );

  useFrame(() => {
    reconstructedSegments[game.currentSegment].curve.getPointAt(
      game.currentSegmentPosition,
      playerPosition.current
    );
  });

  return (
    <>
      <Lights />
      <Camera playerPosition={playerPosition} />
      <Action
        game={game}
        yourPlayerId={yourPlayerId}
        playerPosition={playerPosition}
        reconstructedSegments={reconstructedSegments}
      />
      <Suspense fallback={null}>
        <EffectComposer>
          <Bloom luminanceThreshold={1} />
        </EffectComposer>
      </Suspense>
    </>
  );
};
