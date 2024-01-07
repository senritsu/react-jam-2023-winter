import clsx from "clsx";

import { playerIconLookup } from "./icons/player-icons";
import classes from "./Hud.module.css";
import { useRuneStore } from "../../runeStore";

export const PlayerSelection = () => {
  const players = useRuneStore((state) => state.players);
  const yourPlayerId = useRuneStore((state) => state.yourPlayerId);
  const playerIcons = useRuneStore((state) => state.game.playerIcons);
  const playerColors = useRuneStore((state) => state.game.playerColors);

  return (
    <div className={clsx([classes.buttons, classes.inControl])}>
      {Object.keys(players)
        .filter((x) => x !== yourPlayerId)
        .map((targetPlayerId) => {
          const Icon = playerIconLookup[playerIcons[targetPlayerId]];

          return (
            <button
              key={targetPlayerId}
              type="button"
              onClick={() => {
                Rune.actions.handOverControl({ targetPlayerId });
              }}
              style={{
                ["--player-color" as any]: playerColors[targetPlayerId],
              }}
            >
              <Icon />
            </button>
          );
        })}
    </div>
  );
};
