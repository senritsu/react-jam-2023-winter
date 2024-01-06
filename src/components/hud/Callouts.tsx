import clsx from "clsx";

import classes from "./Hud.module.css";
import { useRuneStore } from "../../runeStore";
import { Callout } from "./Callout";

export const Callouts = () => {
  const yourPlayerId = useRuneStore((state) => state.yourPlayerId);
  const callouts = useRuneStore((state) => state.game.callouts);
  const playerColors = useRuneStore((state) => state.game.playerColors);
  const playerIcons = useRuneStore((state) => state.game.playerIcons);

  return (
    <>
      <div className={clsx([classes.callouts, classes.others])}>
        {callouts
          .filter(({ playerId }) => playerId !== yourPlayerId)
          .map(({ playerId, createdAt, position }) => (
            <Callout
              key={`${playerId}-${createdAt}`}
              playerId={playerId}
              createdAt={createdAt}
              position={position}
              playerIcons={playerIcons}
              playerColors={playerColors}
            />
          ))}
      </div>
      <div className={clsx([classes.callouts, classes.own])}>
        {callouts
          .filter(({ playerId }) => playerId === yourPlayerId)
          .map(({ playerId, createdAt, position }) => (
            <Callout
              key={`${playerId}-${createdAt}`}
              playerId={playerId}
              createdAt={createdAt}
              position={position}
              playerIcons={playerIcons}
              playerColors={playerColors}
            />
          ))}
      </div>
    </>
  );
};
