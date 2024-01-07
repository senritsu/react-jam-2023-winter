import { Box } from "@react-three/drei";
import { useRuneStore } from "../../runeStore";
import { MutableRefObject, useEffect, useRef } from "react";
import { Euler, Mesh, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useSoundStore } from "./soundStore";

export const Enemy = ({
  enemyId,
  playerPosition,
}: {
  enemyId: string;
  playerPosition: MutableRefObject<Vector3>;
}) => {
  const enemy = useRuneStore((state) =>
    state.game.enemies.find((enemy) => enemy.id === enemyId)
  );
  const playerColors = useRuneStore((state) => state.game.playerColors);

  const vectorPositions = useRef(
    enemy?.positions?.map((position) => new Vector3(...position)) ?? [
      new Vector3(),
    ]
  );
  const initialScale = useRef(new Vector3());
  const targetScale = useRef(new Vector3(1, 1, 1));

  const effect = useSoundStore((state) => state.effect);

  useEffect(() => {
    return () => {
      effect.triggerAttackRelease("C1", "16n", "+0");
    };
  }, [enemyId, effect]);

  const boxRef = useRef<Mesh>(null);

  const smoothLifetime = useRef(enemy?.lifetime ?? 4);
  const rotationVector = useRef(
    new Vector3(Math.random(), Math.random(), Math.random())
  );
  const tempRotation = useRef(new Vector3());

  useFrame((state, dt) => {
    smoothLifetime.current = Math.min(
      enemy?.lifetime ?? 4,
      smoothLifetime.current - dt
    );

    if (!boxRef.current) return;

    const mesh = boxRef.current;

    const phase = Math.floor(Math.min(4 - smoothLifetime.current, 3.99));

    const from =
      vectorPositions.current[phase - 1] ?? vectorPositions.current[0];
    const to = vectorPositions.current[phase] ?? playerPosition.current;
    const t = 1 - (smoothLifetime.current % 1);

    const factor = phase < 3 ? easing.cubic.out(t) : easing.cubic.in(t);

    mesh.position.lerpVectors(from, to, factor);
    if (phase === 0) {
      mesh.scale.lerpVectors(
        initialScale.current,
        targetScale.current,
        easing.cubic.in(Math.min(t * 10, 1))
      );
    }
    if (phase === 3) {
      mesh.scale.lerpVectors(
        targetScale.current,
        initialScale.current,
        easing.cubic.in(t)
      );
    }

    tempRotation.current.copy(rotationVector.current);
    tempRotation.current.multiplyScalar(dt * (phase + 1) * Math.PI);

    mesh.rotation.x += tempRotation.current.x;
    mesh.rotation.y += tempRotation.current.y;
    mesh.rotation.z += tempRotation.current.z;
  });

  if (!enemy) return null;

  return (
    <Box
      ref={boxRef}
      position={vectorPositions.current[0]}
      args={[0.75, 0.75, 0.75]}
      onClick={() => {
        Rune.actions.tap({ enemyId });
      }}
    >
      <meshStandardMaterial color={playerColors[enemy?.playerId] ?? "white"} />
    </Box>
  );
};
