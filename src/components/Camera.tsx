import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { MutableRefObject } from "react";
import { Vector3 } from "three";

export const Camera = ({
  playerPosition,
}: {
  playerPosition: MutableRefObject<Vector3>;
}) => {
  useFrame((state) => {
    state.camera.position.x = 0;
    state.camera.position.y = 3;
    state.camera.position.z = playerPosition.current.z - 8;
    state.camera.lookAt(playerPosition.current);
  });

  return <PerspectiveCamera makeDefault />;
};
