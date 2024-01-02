import { Players } from "rune-games-sdk";
import { GameState } from "../logic";

export const Hud = ({
  game,
  yourPlayerId,
  players,
}: {
  game: GameState;
  yourPlayerId: string;
  players: Players;
}) => {
  return (
    <div className="ui">
      <div className="health-bar">
        <div className="health-bar-fill" style={{ width: `${game.health}%` }} />
      </div>
      <img
        width={64}
        height={64}
        src={players[game.currentlyInControl].avatarUrl}
      />
      {game.currentlyInControl === yourPlayerId ? (
        <>
          <div className="buttons">
            {Object.keys(players)
              .filter((x) => x !== yourPlayerId)
              .map((targetPlayerId) => (
                <button
                  key={targetPlayerId}
                  type="button"
                  onClick={() =>
                    Rune.actions.handOverControl({ targetPlayerId })
                  }
                >
                  <img
                    width={32}
                    height={32}
                    src={players[targetPlayerId].avatarUrl}
                  />
                </button>
              ))}
          </div>
        </>
      ) : (
        <div className="buttons">
          <button type="button" onClick={() => Rune.actions.requestControl()}>
            ✋
          </button>
        </div>
      )}
    </div>
  );
};
