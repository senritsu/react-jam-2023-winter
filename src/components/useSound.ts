import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import {
  init,
  startAudio,
  playMml,
  generateMml,
  update,
  playSoundEffect,
  stopMml,
} from "sounds-some-sounds";
import { GameState } from "../logic";

const EFFECT_SEED = 20; // 11;
const BGM_SEED = 11;
const DANGER_BGM_SEED = 10;

export let isInitialized = false;

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

const setup = () => {
  if (isInitialized) return;

  startAudio();
  isInitialized = true;

  playMml(bgmDefault);
};

export const useSound = (game: GameState) => {
  useEffect(() => {
    init(EFFECT_SEED);

    document.addEventListener("mousedown", setup);
    document.addEventListener("touchstart", setup);

    return () => {
      document.removeEventListener("mousedown", setup);
      document.removeEventListener("touchstart", setup);
    };
  }, []);

  const wasInDanger = useRef(false);
  const isInDanger = !game.correctPlayerIsInControl;

  const previousLevel = useRef(game.currentLevel);

  useFrame(() => {
    if (!isInitialized) return;

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
