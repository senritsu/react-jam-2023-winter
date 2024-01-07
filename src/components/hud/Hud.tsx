import { PlayerSelection } from "./PlayerSelection";
import { CalloutButton } from "./CalloutButton";

import classes from "./Hud.module.css";
import { useRuneStore } from "../../runeStore";
import { DebugInfo } from "./DebugInfo";
import { HealthBar } from "./HealthBar";
import { Callouts } from "./Callouts";
import { LevelInfo } from "./LevelInfo";

export const Hud = ({ showDebugInfo }: { showDebugInfo?: boolean }) => {
  const yourPlayerId = useRuneStore((state) => state.yourPlayerId);
  const activePlayerId = useRuneStore((state) => state.game.activePlayerId);
  const playerColors = useRuneStore((state) => state.game.playerColors);

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

      <LevelInfo />

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
