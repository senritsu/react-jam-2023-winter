import { Players } from "rune-games-sdk";
import { GameState } from "../../logic";
import { PlayerSelection } from "./PlayerSelection";
import { CalloutButton } from "./CalloutButton";
import { Callout } from "./Callout";

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
      className="ui"
      style={{
        ["--player-color" as any]: game.playerColors[yourPlayerId],
        ["--active-player-color" as any]:
          game.playerColors[game.activePlayerId],
      }}
    >
      <div className="health-bar">
        <div
          className={`health-bar-fill ${
            game.health < 20 ? "critical" : game.health < 50 ? "low" : ""
          }`}
          style={{ width: `${game.health}%` }}
        />
      </div>

      <div className="info">
        <h1>{game.currentLevel}</h1>
      </div>

      {showDebugInfo && (
        <div className="debug">
          <span>total distance: {game.totalDistance.toFixed(2)}</span>
          <span>
            segment distance: {game.currentSegmentDistance.toFixed(2)}
          </span>
          <span>segment: {game.currentSegment.id}</span>
          <span>level: {game.currentLevel}</span>
        </div>
      )}

      <div className="callouts others">
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
      <div className="callouts own">
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

      <div className="divider"></div>

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
