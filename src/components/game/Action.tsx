import { MutableRefObject, useRef } from "react";
import {
  BufferGeometry,
  Material,
  Mesh,
  NormalBufferAttributes,
  Object3DEventMap,
  Vector3,
} from "three";
import { Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { playSoundEffect } from "sounds-some-sounds";

import { LevelSegment } from "./LevelSegment";
import { GameState } from "../../logic.types";

export const Action = ({
  game,
  yourPlayerId,
  playerPosition,
}: {
  game: GameState;
  yourPlayerId?: string;
  playerPosition: MutableRefObject<Vector3>;
}) => {
  const sphereRef =
    useRef<
      Mesh<
        BufferGeometry<NormalBufferAttributes>,
        Material | Material[],
        Object3DEventMap
      >
    >(null);

  const gameover = useRef(false);

  useFrame(() => {
    if (!sphereRef.current || !playerPosition) return;

    sphereRef.current.position.copy(playerPosition.current);

    if (game.health <= 0 && !gameover.current) {
      playSoundEffect("explosion");
      gameover.current = true;
    }
  });

  const orbColor = game.activePlayerId
    ? game.playerColors[game.activePlayerId]
    : "white";

  return (
    <>
      {/* <Tube args={[curve, game.path.length * 10, 0.1, 8, false]} /> */}
      {Object.values(game.segments)
        .filter((x) => x)
        .map((segment) => {
          const isCorrect = segment.owner === game.activePlayerId;
          const isCurrent = segment.id === game.currentSegmentId;

          return (
            <LevelSegment
              key={segment.id}
              segment={segment}
              isCorrect={isCorrect}
              isCurrent={isCurrent}
              playerColors={game.playerColors}
              yourPlayerId={yourPlayerId}
            />
          );
        })}
      <Sphere ref={sphereRef} args={[0.2]}>
        <meshStandardMaterial
          color={orbColor}
          emissive={orbColor}
          emissiveIntensity={game.correctPlayerIsInControl ? 15 : 0.5}
          toneMapped={false}
        />
      </Sphere>
    </>
  );
};
