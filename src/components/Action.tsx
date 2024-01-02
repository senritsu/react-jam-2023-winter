import { Sphere, Tube } from "@react-three/drei";
import { GameState } from "../logic";
import {
  BufferGeometry,
  CubicBezierCurve3,
  Material,
  Mesh,
  NormalBufferAttributes,
  Object3DEventMap,
  Vector3,
} from "three";
import { useFrame } from "@react-three/fiber";
import { MutableRefObject, useRef } from "react";

export const Action = ({
  game,
  yourPlayerId,
  playerPosition,
  reconstructedSegments,
}: {
  game: GameState;
  yourPlayerId?: string;
  playerPosition: MutableRefObject<Vector3>;
  reconstructedSegments: { curve: CubicBezierCurve3; owner: string }[];
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

  return (
    <>
      {/* <Tube args={[curve, game.path.length * 10, 0.1, 8, false]} /> */}
      {reconstructedSegments.map(({ curve, owner }, index) => (
        <Tube key={index} args={[curve, 10, 0.1, 8, false]}>
          <meshStandardMaterial
            color={yourPlayerId === owner ? "skyblue" : "hsl(260, 40%, 20%)"}
            emissive={yourPlayerId === owner ? "skyblue" : "hsl(260, 40%, 20%)"}
            emissiveIntensity={yourPlayerId === owner ? 3 : 0.5}
            toneMapped={false}
          />
        </Tube>
      ))}
      <Sphere ref={sphereRef} args={[0.2]}>
        <meshStandardMaterial
          color={game.correctController ? "skyblue" : "red"}
          emissive={game.correctController ? "skyblue" : "red"}
          emissiveIntensity={game.correctController ? 5 : 0.5}
          toneMapped={false}
        />
      </Sphere>
    </>
  );
};
