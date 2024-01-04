import { Sphere } from "@react-three/drei";
import { GameState } from "../logic";
import {
  BufferGeometry,
  Material,
  Mesh,
  NormalBufferAttributes,
  Object3DEventMap,
  Vector3,
} from "three";
import { useFrame } from "@react-three/fiber";
import { MutableRefObject, useRef } from "react";
import { LevelSegment } from "./LevelSegment";

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

  useFrame(() => {
    if (!sphereRef.current || !playerPosition) return;

    sphereRef.current.position.copy(playerPosition.current);
  });

  const orbColor = game.playerColors[game.activePlayerId];

  return (
    <>
      {/* <Tube args={[curve, game.path.length * 10, 0.1, 8, false]} /> */}
      {game.segments.map((segment) => {
        const isCorrect = segment.owner === game.activePlayerId;
        const isCurrent = segment.id === game.currentSegment.id;

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
