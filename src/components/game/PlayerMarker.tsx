import { MutableRefObject, useRef } from "react";
import {
  BufferGeometry,
  Material,
  Mesh,
  MeshStandardMaterial,
  NormalBufferAttributes,
  Object3DEventMap,
  Vector3,
} from "three";
import { useRuneStore } from "../../runeStore";
import { Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export const PlayerMarker = ({
  playerPosition,
}: {
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

  const materialRef = useRef<MeshStandardMaterial>(null);

  const orbColor = useRuneStore((state) =>
    state.game.activePlayerId
      ? state.game.playerColors[state.game.activePlayerId]
      : "white"
  );
  const correctPlayerIsInControl = useRuneStore(
    (state) => state.game.correctPlayerIsInControl
  );

  useFrame(() => {
    if (!sphereRef.current || !playerPosition) return;

    sphereRef.current.position.copy(playerPosition.current);
  });

  return (
    <Sphere ref={sphereRef} args={[0.2]}>
      <meshStandardMaterial
        ref={materialRef}
        color={orbColor}
        emissive={orbColor}
        emissiveIntensity={correctPlayerIsInControl ? 15 : 0.5}
        toneMapped={false}
      />
    </Sphere>
  );
};
