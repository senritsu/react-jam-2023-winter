import clsx from "clsx";
import classes from "./GetReady.module.css";
import { COLORS } from "../../logic";
import { playerIconLookup } from "../hud/icons/player-icons";
import { useRuneStore } from "../../runeStore";

const tutorialMessages = [
  "Glow = good",
  "One player is active",
  "Switch if needed",
  "Communicate",
];

const tutorialMessageColors = COLORS.slice(1);

export const GetReady = () => {
  const yourPlayerId = useRuneStore((state) => state.yourPlayerId);
  const playerIcons = useRuneStore((state) => state.game.playerIcons);
  const playerColors = useRuneStore((state) => state.game.playerColors);
  const readyStatus = useRuneStore((state) => state.game.readyStatus);
  const countdown = useRuneStore((state) => state.game.countdown);

  const YourIcon = yourPlayerId
    ? playerIconLookup[playerIcons[yourPlayerId]]
    : null;

  return (
    <main className={classes.layout}>
      <header className={classes.title}>
        <h1>How to play</h1>
      </header>
      <section className={classes.tutorial}>
        <ol>
          {tutorialMessages.map((message, i) => (
            <li
              key={message}
              style={{
                color: tutorialMessageColors[i],
              }}
            >
              {message}
            </li>
          ))}
        </ol>
      </section>
      <section className={classes.status}>
        {Object.entries(readyStatus).map(([playerId, ready]) => {
          const Icon = playerIconLookup[playerIcons[playerId]];
          const color = playerColors[playerId];

          return (
            <div
              key={playerId}
              className={clsx({ [classes.ready]: ready })}
              style={{ ["--player-color" as any]: color }}
            >
              <Icon />
            </div>
          );
        })}
      </section>

      {yourPlayerId && YourIcon && (
        <button
          style={{ ["--player-color" as any]: playerColors[yourPlayerId] }}
          className={clsx(classes.button, {
            [classes.ready]: readyStatus[yourPlayerId],
          })}
          onClick={() => Rune.actions.ready()}
        >
          <YourIcon />
          Ready
        </button>
      )}

      {countdown && (
        <div className={classes.countdown}>
          <span key={Math.ceil(countdown)}>{Math.ceil(countdown)}</span>
        </div>
      )}
    </main>
  );
};
