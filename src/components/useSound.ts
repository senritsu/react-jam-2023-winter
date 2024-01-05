import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import {
  init,
  startAudio,
  playMml,
  generateMml,
  update,
} from "sounds-some-sounds";

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

export const useSound = (danger: boolean) => {
  useEffect(() => {
    init(EFFECT_SEED);

    document.addEventListener("mousedown", setup);
    document.addEventListener("touchstart", setup);

    return () => {
      document.removeEventListener("mousedown", setup);
      document.removeEventListener("touchstart", setup);
    };
  }, []);

  const previousDanger = useRef(danger);

  useFrame(() => {
    if (isInitialized) {
      update();

      if (previousDanger.current !== danger) {
        playMml(danger ? bgmDanger : bgmDefault);
        previousDanger.current = danger;
      }
    }
  });
};
