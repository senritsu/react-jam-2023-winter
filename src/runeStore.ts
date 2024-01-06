import { create } from "zustand";
import { GameState } from "./logic.types";
import { Players } from "rune-games-sdk";

type RuneStoreState = {
  game: GameState;
  players: Players;
  yourPlayerId: string;
};

export const useRuneStore = create<RuneStoreState>((set) => {
  Rune.initClient({
    onChange: ({ game, players, yourPlayerId }) => {
      set((state) => ({ ...state, game, players, yourPlayerId }));
    },
  });

  // kind of wrong, but App.tsx checks if rune is loaded before rendering anything, so this makes typing downstream a lot easier
  return {
    game: {} as GameState,
    players: {},
    yourPlayerId: "",
  };
});
