import clsx from "clsx";
import classes from "./GetReady.module.css";
import { COLORS, GameState } from "../../logic";
import { playerIconLookup } from "../hud/icons/player-icons";

export const GetReady = ({
  game,
  yourPlayerId,
}: {
  game: GameState;
  yourPlayerId?: string;
}) => {
  const allColors = COLORS.slice(1);

  const YourIcon = yourPlayerId
    ? playerIconLookup[game.playerIcons[yourPlayerId]]
    : null;

  return (
    <main className={classes.layout}>
      <header className={classes.title}>
        <h1>How to play</h1>
      </header>
      <section className={classes.tutorial}>
        <ol>
          <li
            style={{
              color: allColors[0],
            }}
          >
            Glow = good
          </li>
          <li
            style={{
              color: allColors[1],
            }}
          >
            One player is active
          </li>
          <li
            style={{
              color: allColors[2],
            }}
          >
            Switch if needed
          </li>
          <li
            style={{
              color: allColors[3],
            }}
          >
            Tell the others when
          </li>
        </ol>
      </section>
      <section className={classes.status}>
        {Object.entries(game.readyStatus).map(([playerId, ready]) => {
          const Icon = playerIconLookup[game.playerIcons[playerId]];
          const color = game.playerColors[playerId];

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
          style={{ ["--player-color" as any]: game.playerColors[yourPlayerId] }}
          className={clsx(classes.button, {
            [classes.ready]: game.readyStatus[yourPlayerId],
          })}
          onClick={() => Rune.actions.ready()}
        >
          <YourIcon />
          Ready
        </button>
      )}

      {game.countdown && (
        <div className={classes.countdown}>
          <span key={Math.ceil(game.countdown)}>
            {Math.ceil(game.countdown)}
          </span>
        </div>
      )}
    </main>
  );
};
