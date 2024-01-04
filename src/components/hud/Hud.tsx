import { Players } from "rune-games-sdk";
import { GameState } from "../../logic";
import { PlayerSelection } from "./PlayerSelection";
import { CalloutButton } from "./CalloutButton";
import { Callouts } from "./Callouts";

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
      style={{ ["--player-color" as any]: game.playerColors[yourPlayerId] }}
    >
      <div className="health-bar">
        <div className="health-bar-fill" style={{ width: `${game.health}%` }} />
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
        <Callouts
          callouts={game.callouts.filter(
            ({ playerId }) => playerId !== yourPlayerId
          )}
          playerColors={game.playerColors}
          playerIcons={game.playerIcons}
        />
      </div>
      <div className="callouts own">
        <Callouts
          callouts={game.callouts.filter(
            ({ playerId }) => playerId === yourPlayerId
          )}
          playerColors={game.playerColors}
          playerIcons={game.playerIcons}
        />
      </div>
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
