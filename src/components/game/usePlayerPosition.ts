import { useMemo, useRef } from "react";
import { CubicBezierCurve3, Vector3 } from "three";
import { useRuneStore } from "../../runeStore";
import { useFrame } from "@react-three/fiber";

export const usePlayerPosition = () => {
  const playerPosition = useRef(new Vector3());

  const currentSegment = useRuneStore(
    (state) => state.game.segments[state.game.currentSegmentId]
  );
  const currentSegmentDistance = useRuneStore(
    (state) => state.game.currentSegmentDistance
  );

  const curve = useMemo(
    () =>
      new CubicBezierCurve3(
        ...currentSegment.curveParameters.map((x) => new Vector3(...x))
      ),
    [currentSegment]
  );

  useFrame(() => {
    curve.getPointAt(
      currentSegmentDistance / currentSegment.length,
      playerPosition.current
    );
  });

  return playerPosition;
};
