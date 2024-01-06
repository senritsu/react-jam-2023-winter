import { PlayerSelection } from "./PlayerSelection";
import { CalloutButton } from "./CalloutButton";

import classes from "./Hud.module.css";
import { useRuneStore } from "../../runeStore";
import { DebugInfo } from "./DebugInfo";
import { HealthBar } from "./HealthBar";
import { Callouts } from "./Callouts";

export const Hud = ({ showDebugInfo }: { showDebugInfo?: boolean }) => {
  const yourPlayerId = useRuneStore((state) => state.yourPlayerId);
  const activePlayerId = useRuneStore((state) => state.game.activePlayerId);
  const playerColors = useRuneStore((state) => state.game.playerColors);

  const currentLevel = useRuneStore((state) => state.game.currentLevel);

  return (
    <div
      className={classes.hud}
      style={{
        ["--player-color" as any]: playerColors[yourPlayerId],
        ["--active-player-color" as any]: activePlayerId
          ? playerColors[activePlayerId]
          : "white",
      }}
    >
      <HealthBar />

      <div className={classes.info}>
        <h1>{currentLevel}</h1>
      </div>

      {showDebugInfo && <DebugInfo />}

      <Callouts />

      {yourPlayerId && (
        <>
          <div className={classes.divider} />

          {activePlayerId === yourPlayerId ? (
            <PlayerSelection />
          ) : (
            <CalloutButton />
          )}
        </>
      )}
    </div>
  );
};
