import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import {
  playMml,
  generateMml,
  update,
  playSoundEffect,
  stopMml,
} from "sounds-some-sounds";
import { GameState } from "../../logic";

const BGM_SEED = 11;
const DANGER_BGM_SEED = 10;

const bgmDanger = generateMml({
  seed: DANGER_BGM_SEED,
  partCount: 2,
  drumPartRatio: 0.75,
});

const bgmDefault = generateMml({
  seed: BGM_SEED,
  partCount: 3,
  drumPartRatio: 0.5,
});

export const useSound = (game: GameState) => {
  useEffect(() => {
    return () => {
      stopMml();
    };
  }, []);

  const wasInDanger = useRef<boolean>();
  const isInDanger = !game.correctPlayerIsInControl;

  const previousLevel = useRef(game.currentLevel);

  useFrame(() => {
    update();

    if (wasInDanger.current !== isInDanger && game.health > 0) {
      playMml(isInDanger ? bgmDanger : bgmDefault);
      wasInDanger.current = isInDanger;
    }

    if (game.health <= 0) {
      stopMml();
    }

    if (game.currentLevel !== previousLevel.current) {
      playSoundEffect("coin");
      previousLevel.current = game.currentLevel;
    }
  });
};
