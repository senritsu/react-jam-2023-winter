import type { Players } from "rune-games-sdk";
import clsx from "clsx";
import { PlayerSelection } from "./PlayerSelection";
import { CalloutButton } from "./CalloutButton";
import { Callout } from "./Callout";

import classes from "./Hud.module.css";
import { GameState } from "../../logic.types";

export const Hud = ({
  game,
  yourPlayerId,
  players,
  showDebugInfo,
}: {
  game: GameState;
  yourPlayerId: string;
  players: Players;
  showDebugInfo?: boolean;
}) => {
  return (
    <div
      className={classes.hud}
      style={{
        ["--player-color" as any]: game.playerColors[yourPlayerId],
        ["--active-player-color" as any]: game.activePlayerId
          ? game.playerColors[game.activePlayerId]
          : "white",
      }}
    >
      <div className={clsx(classes.health, classes.bar)}>
        <div
          className={clsx(classes.health, classes.fill, {
            low: game.health < 50,
            critical: game.health < 20,
          })}
          style={{ width: `${game.health}%` }}
        />
      </div>

      <div className={classes.info}>
        <h1>{game.currentLevel}</h1>
      </div>

      {showDebugInfo && (
        <div className={classes.debug}>
          <span>total distance: {game.totalDistance.toFixed(2)}</span>
          <span>
            segment distance: {game.currentSegmentDistance.toFixed(2)}
          </span>
          <span>segment: {game.currentSegmentId}</span>
          <span>level: {game.currentLevel}</span>
        </div>
      )}

      <div className={clsx([classes.callouts, classes.others])}>
        {game.callouts
          .filter(({ playerId }) => playerId !== yourPlayerId)
          .map(({ playerId, createdAt, position }) => (
            <Callout
              key={`${playerId}-${createdAt}`}
              playerId={playerId}
              createdAt={createdAt}
              position={position}
              playerIcons={game.playerIcons}
              playerColors={game.playerColors}
            />
          ))}
      </div>
      <div className={clsx([classes.callouts, classes.own])}>
        {game.callouts
          .filter(({ playerId }) => playerId === yourPlayerId)
          .map(({ playerId, createdAt, position }) => (
            <Callout
              key={`${playerId}-${createdAt}`}
              playerId={playerId}
              createdAt={createdAt}
              position={position}
              playerIcons={game.playerIcons}
              playerColors={game.playerColors}
            />
          ))}
      </div>

      <div className={classes.divider}></div>

      {game.activePlayerId === yourPlayerId ? (
        <PlayerSelection
          game={game}
          players={players}
          yourPlayerId={yourPlayerId}
        />
      ) : (
        <CalloutButton />
      )}
    </div>
  );
};
