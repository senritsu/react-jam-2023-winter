import { Box, Line, Tube } from "@react-three/drei";
import { CubicBezierCurve3, Vector3 } from "three";
import { useMemo } from "react";

import { GameState, Segment } from "../../logic";

export const LevelSegment = ({
  playerColors,
  isCurrent,
  isCorrect,
  yourPlayerId,
  segment,
  showDebugInfo,
}: {
  playerColors: GameState["playerColors"];
  isCurrent?: boolean;
  isCorrect?: boolean;
  yourPlayerId?: string;
  segment: Segment;
  showDebugInfo?: boolean;
}) => {
  const ownSegmentOrSpectator = !yourPlayerId || segment.owner === yourPlayerId;

  const color = ownSegmentOrSpectator
    ? playerColors[segment.owner]
    : "hsl(260, 40%, 20%)";

  const glow = ownSegmentOrSpectator && isCorrect && isCurrent;

  const curve = useMemo(
    () =>
      new CubicBezierCurve3(
        ...segment.curveParameters.map((x) =>
          new Vector3(...x).add(new Vector3(segment.id % 2 ? 0 : 0, 0, 0))
        )
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
          <Line points={[curve.v0, curve.v1]} color="blue"></Line>
          <Box args={[0.1, 1, 0.1]} position={curve.v0}>
            <meshStandardMaterial color="blue" />
          </Box>
          <Box args={[0.1, 0.1, 0.1]} position={curve.v1}>
            <meshStandardMaterial color="red" />
          </Box>
          <Line points={[curve.v3, curve.v2]} color="cyan"></Line>
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
          emissiveIntensity={glow ? 15 : 0.5}
          toneMapped={false}
        />
      </Tube>
    </>
  );
};
