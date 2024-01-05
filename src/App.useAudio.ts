import { useEffect } from "react";
import { init, startAudio } from "sounds-some-sounds";

export let isInitialized = false;
const EFFECT_SEED = 20; // 11;

export const setup = () => {
  if (isInitialized) return;

  init(EFFECT_SEED);
  startAudio();

  isInitialized = true;
};

export const useAudio = () => {
  useEffect(() => {
    document.addEventListener("pointerdown", setup);

    return () => {
      document.removeEventListener("pointerdown", setup);
    };
  }, []);
};
