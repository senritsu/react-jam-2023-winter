import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { Color } from "three";

import { useRuneStore } from "../../runeStore";

export const useDynamicLevelBackground = () => {
  const currentLevelBackground = useRuneStore(
    (state) => state.game.currentLevelBackground
  );

  const { scene } = useThree();
  const color = useMemo(
    () => new Color(currentLevelBackground),
    [currentLevelBackground]
  );

  useFrame(() => {
    if (scene.background instanceof Color) {
      scene.background.lerp(color, 0.05);
      scene.fog?.color.set(scene.background);
    }
  });
};
