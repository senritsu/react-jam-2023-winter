import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import { useRuneStore } from "../../runeStore";
import { useSoundStore } from "./soundStore";

export const GameOverSound = () => {
  const gameover = useRef(false);

  const health = useRuneStore((state) => state.game.health);

  const effect = useSoundStore((state) => state.effect);

  useFrame(() => {
    if (health <= 0 && !gameover.current) {
      effect.triggerAttackRelease("Gb4", "8n", "+0", 0.5);
      effect.triggerAttackRelease("F4", "8n", "+0.2", 0.5);
      effect.triggerAttackRelease("E4", "8n", "+0.4", 0.5);
      effect.triggerAttackRelease("Eb4", "2n", "+0.6", 0.5);

      gameover.current = true;
    }
  });

  return null;
};
