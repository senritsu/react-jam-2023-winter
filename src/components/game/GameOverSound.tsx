import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { playSoundEffect } from "sounds-some-sounds";

import { useRuneStore } from "../../runeStore";

export const GameOverSound = () => {
  const gameover = useRef(false);

  const health = useRuneStore((state) => state.game.health);

  useFrame(() => {
    if (health <= 0 && !gameover.current) {
      playSoundEffect("explosion");
      gameover.current = true;
    }
  });

  return null;
};
