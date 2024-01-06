import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import {
  playMml,
  generateMml,
  update,
  playSoundEffect,
  stopMml,
  type Track,
} from "sounds-some-sounds";
import { useRuneStore } from "../../runeStore";
import { isInitialized } from "../../App.useAudio";

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

export const useSoundUpdate = () => {
  useFrame(() => {
    if (!isInitialized) return;

    update();
  });
};

export const useDynamicBgm = () => {
  const correctPlayerIsInControl = useRuneStore(
    (state) => state.game.correctPlayerIsInControl
  );
  const health = useRuneStore((state) => state.game.health);

  const track = useRef<Track>();

  const wasInDanger = useRef<boolean>();
  const isInDanger = !correctPlayerIsInControl;

  useFrame(() => {
    if (!isInitialized) return;

    if (wasInDanger.current !== isInDanger && health > 0) {
      const playhead = track.current?.nextNotesTime ?? 0;

      track.current = playMml(isInDanger ? bgmDanger : bgmDefault);
      track.current.nextNotesTime = playhead;

      wasInDanger.current = isInDanger;
    }

    if (health <= 0) {
      stopMml();
    }
  });
};

export const useLevelChangeSound = () => {
  const currentLevel = useRuneStore((state) => state.game.currentLevel);

  const previousLevel = useRef(currentLevel);

  useFrame(() => {
    if (!isInitialized) return;

    if (currentLevel !== previousLevel.current) {
      playSoundEffect("coin");
      previousLevel.current = currentLevel;
    }
  });
};
