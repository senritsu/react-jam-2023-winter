import { useRuneStore } from "../../runeStore";
import classes from "./Hud.module.css";

export const LevelInfo = () => {
  const currentLevel = useRuneStore((state) => state.game.currentLevel);
  const levelProgress = useRuneStore(
    (state) =>
      (state.game.totalDistance % state.game.settings.LEVEL_LENGTH) /
      state.game.settings.LEVEL_LENGTH
  );

  return (
    <div className={classes.info}>
      <svg className={classes.progress} viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="var(--color-ui)"
          strokeWidth="10"
        />
        <circle
          className={classes.fill}
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="var(--color-ui-separator)"
          strokeWidth="10"
          strokeDasharray={`${levelProgress * 276.5} 276.5`}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <h1 className={classes.level}>{currentLevel}</h1>
    </div>
  );
};
