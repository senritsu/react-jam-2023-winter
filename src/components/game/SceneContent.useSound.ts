import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useRuneStore } from "../../runeStore";
import { useSoundStore } from "./soundStore";
import * as Tone from "tone";

export const useDynamicBgm = () => {
  const previouslyCorrectPlayerIsInControl = useRef<boolean>();
  const correctPlayerIsInControl = useRuneStore(
    (state) => state.game.correctPlayerIsInControl
  );
  const health = useRuneStore((state) => state.game.health);

  const bass = useSoundStore((state) => state.bass);
  const lead = useSoundStore((state) => state.lead);
  const filter = useSoundStore((state) => state.filter);

  const bassPart = useRef<Tone.Loop>();
  const melodyPart = useRef<Tone.Part>();

  useEffect(() => {
    bassPart.current = new Tone.Loop((time) => {
      bass.triggerAttackRelease("C2", "32n", time);
    }, "16n");

    melodyPart.current = new Tone.Part(
      (time, note) => {
        lead.triggerAttackRelease(note, "32n", time);
      },
      [
        ["0:0:0", "C3"],
        ["0:0:1", "E3"],
        ["0:0:2", "F3"],
        ["0:0:3", "C3"],
        ["0:1:0", "E3"],
        ["0:1:1", "F3"],
        ["0:1:2", "C3"],
        ["0:1:3", "E3"],
        ["0:2:0", "F3"],
        ["0:2:1", "C3"],
        ["0:2:2", "E3"],
        ["0:2:3", "F3"],
        ["0:3:0", "C3"],
        ["0:3:1", "E3"],
        ["0:3:2", "F3"],
        ["0:3:3", "E3"],
      ]
    );
    melodyPart.current.loop = true;
    melodyPart.current.loopEnd = "1:0:0";
    melodyPart.current.probability = 0.75;

    bassPart.current.start();
    melodyPart.current.start();

    return () => {
      bassPart.current?.dispose();
      melodyPart.current?.dispose();
    };
  }, [bass, lead]);

  useFrame(() => {
    if (
      previouslyCorrectPlayerIsInControl.current !== correctPlayerIsInControl
    ) {
      filter.set({ frequency: correctPlayerIsInControl ? 0 : 700 });
      previouslyCorrectPlayerIsInControl.current = correctPlayerIsInControl;
    }

    if (health <= 0) {
      bassPart.current?.stop();
      melodyPart.current?.stop();
    }
  });
};

export const useLevelChangeSound = () => {
  const currentLevel = useRuneStore((state) => state.game.currentLevel);

  const previousLevel = useRef(currentLevel);

  const effect = useSoundStore((state) => state.effect);

  useFrame(() => {
    if (currentLevel !== previousLevel.current) {
      effect.triggerAttackRelease("F4", "32n");
      effect.triggerAttackRelease("C5", "32n", "+0.05");
      previousLevel.current = currentLevel;
    }
  });
};

export const useActivePlayerChangeSound = () => {
  const activePlayerId = useRuneStore((state) => state.game.activePlayerId);
  const previousActivePlayerId = useRef(activePlayerId);

  const noise = useSoundStore((state) => state.noise);

  useFrame(() => {
    if (activePlayerId !== previousActivePlayerId.current) {
      noise.triggerAttackRelease("4n");

      previousActivePlayerId.current = activePlayerId;
    }
  });
};

export const useCalloutSounds = () => {
  const playerNotes = useRuneStore((state) => state.game.playerNotes);
  const callouts = useRuneStore((state) => state.game.callouts);

  const hasBeenPlayed = useRef<Record<string, boolean>>({});
  const stillActive = useRef(new Set<string>());

  const effect = useSoundStore((state) => state.effect);

  useFrame(() => {
    stillActive.current.clear();

    for (const callout of callouts) {
      const hash = `${callout.playerId}-${callout.createdAt}`;

      stillActive.current.add(hash);

      if (!hasBeenPlayed.current[hash]) {
        const note = playerNotes[callout.playerId];

        effect.triggerAttackRelease(note, "16n", "+0", 0.5);
        // effect.triggerAttackRelease("C4", "16n", "+16n", 0.5);

        hasBeenPlayed.current[hash] = true;
      }
    }

    for (const hash of Object.keys(hasBeenPlayed.current)) {
      if (!stillActive.current.has(hash)) {
        delete hasBeenPlayed.current[hash];
      }
    }
  });
};

export const useIncreasingBpm = () => {
  const currentLevel = useRuneStore((state) => state.game.currentLevel);

  useFrame(() => {
    Tone.Transport.bpm.value = 120 + (currentLevel - 1) * 2;
  });
};
