import { Box, Line, Tube } from "@react-three/drei";
import { CubicBezierCurve3, Vector3 } from "three";
import { useMemo } from "react";

import { useRuneStore } from "../../runeStore";

export const LevelSegment = ({
  segmentId,
  showDebugInfo,
}: {
  segmentId: number;
  showDebugInfo?: boolean;
}) => {
  const yourPlayerId = useRuneStore((state) => state.yourPlayerId);
  const activePlayerId = useRuneStore((state) => state.game.activePlayerId);
  const currentSegmentId = useRuneStore((state) => state.game.currentSegmentId);
  const playerColors = useRuneStore((state) => state.game.playerColors);

  const segment = useRuneStore((state) => state.game.segments[segmentId]);

  const isCorrect = segment.owner === activePlayerId;
  const isCurrent = segment.id === currentSegmentId;

  const ownSegmentOrSpectator = !yourPlayerId || segment.owner === yourPlayerId;

  const color = ownSegmentOrSpectator
    ? playerColors[segment.owner]
    : "hsl(260, 40%, 20%)";

  const isGlowing = ownSegmentOrSpectator && isCorrect && isCurrent;

  const curve = useMemo(
    () =>
      new CubicBezierCurve3(
        ...segment.curveParameters.map((x) => new Vector3(...x))
      ),
    [segment]
  );

  const tubularSegments = 24;
  const radius = 0.1;
  const radialSegments = 12;

  return (
    <>
      {showDebugInfo && (
        <>
          <Line points={[curve.v0, curve.v1]} color="blue" />
          <Box args={[0.1, 1, 0.1]} position={curve.v0}>
            <meshStandardMaterial color="blue" />
          </Box>
          <Box args={[0.1, 0.1, 0.1]} position={curve.v1}>
            <meshStandardMaterial color="red" />
          </Box>
          <Line points={[curve.v3, curve.v2]} color="cyan" />
          <Box args={[0.1, 0.1, 0.1]} position={curve.v2}>
            <meshStandardMaterial color="green" />
          </Box>
          <Box args={[0.1, 1, 0.1]} position={curve.v3}>
            <meshStandardMaterial color="cyan" />
          </Box>
        </>
      )}
      <Tube args={[curve, tubularSegments, radius, radialSegments]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isGlowing ? 15 : 0.5}
          toneMapped={false}
        />
      </Tube>
    </>
  );
};
