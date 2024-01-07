import * as Tone from "tone";
import { create } from "zustand";

type SoundStoreState = {
  initialized: boolean;
  initialize: () => Promise<void>;

  bass: Tone.Synth;
  lead: Tone.Synth;
  effect: Tone.Synth;
  noise: Tone.NoiseSynth;
  filter: Tone.Filter;
};

export const useSoundStore = create<SoundStoreState>(
  (set, get) =>
    ({
      initialized: false,
      initialize: async () => {
        if (get().initialized) return;

        await Tone.start();

        const master = new Tone.Channel().toDestination();

        const filter = new Tone.Filter(0, "highpass").connect(master);

        const bass = new Tone.Synth({
          oscillator: {
            type: "triangle",
          },
          envelope: {
            release: 0.07,
          },
        }).connect(filter);

        const leadChannel = new Tone.Channel(-12).connect(filter);

        const lead = new Tone.Synth({
          oscillator: {
            type: "pulse",
          },
          envelope: {
            release: 0.07,
          },
        }).connect(leadChannel);

        const effect = new Tone.Synth({
          oscillator: {
            type: "pulse",
          },
          envelope: {
            release: 0.21,
          },
        }).connect(master);

        const noise = new Tone.NoiseSynth().connect(master);

        Tone.Transport.start();

        set(() => ({
          initialized: true,
          bass,
          lead,
          effect,
          noise,
          filter,
        }));
      },
    } as SoundStoreState)
);
