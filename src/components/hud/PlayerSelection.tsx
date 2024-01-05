import { Players } from "rune-games-sdk";

import { playerIconLookup } from "./icons/player-icons";
import { GameState } from "../../logic";
import { playSoundEffect } from "sounds-some-sounds";
import clsx from "clsx";

import classes from "./Hud.module.css";

export const PlayerSelection = ({
  game,
  players,
  yourPlayerId,
}: {
  game: GameState;
  players: Players;
  yourPlayerId: string;
}) => {
  return (
    <div className={clsx([classes.buttons, classes.inControl])}>
      {Object.keys(players)
        .filter((x) => x !== yourPlayerId)
        .map((targetPlayerId) => {
          const Icon = playerIconLookup[game.playerIcons[targetPlayerId]];

          return (
            <button
              key={targetPlayerId}
              type="button"
              onClick={() => {
                playSoundEffect("click");
                Rune.actions.handOverControl({ targetPlayerId });
              }}
              style={{
                ["--player-color" as any]: game.playerColors[targetPlayerId],
              }}
            >
              <Icon />
            </button>
          );
        })}
    </div>
  );
};
