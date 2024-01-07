import { playerIconLookup } from "./icons/player-icons";

import classes from "./Hud.module.css";

export const Callout = ({
  playerId,
  position,
  playerColors,
  playerIcons,
}: {
  playerIcons: Record<string, string>;
  playerColors: Record<string, string>;
  playerId: string;
  createdAt: number;
  position: [number, number];
}) => {
  const Icon = playerIconLookup[playerIcons[playerId]];
  const [x, y] = position;

  return (
    <div
      className={classes.callout}
      style={{
        top: `${20 + y * 60}%`,
        left: `${20 + x * 60}%`,
        ["--player-color" as any]: playerColors[playerId],
      }}
    >
      <Icon />
    </div>
  );
};
