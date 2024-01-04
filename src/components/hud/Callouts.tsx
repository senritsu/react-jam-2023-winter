import { GameState } from "../../logic";
import { playerIconLookup } from "./icons/player-icons";

export const Callouts = ({
  callouts,
  playerColors,
  playerIcons,
}: Pick<GameState, "callouts" | "playerColors" | "playerIcons">) => {
  return callouts.map(({ playerId, createdAt, position }) => {
    const key = `${playerId}-${createdAt}`;

    const Icon = playerIconLookup[playerIcons[playerId]];
    const [x, y] = position;

    return (
      <div
        key={key}
        className="callout"
        style={{
          top: `${20 + y * 60}%`,
          left: `${20 + x * 60}%`,
          ["--player-color" as any]: playerColors[playerId],
        }}
      >
        <Icon />
      </div>
    );
  });
};
