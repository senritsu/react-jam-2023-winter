import clsx from "clsx";

import classes from "./Hud.module.css";
import { useRuneStore } from "../../runeStore";

export const HealthBar = () => {
  const health = useRuneStore((state) => state.game.health);

  return (
    <div className={clsx(classes.health, classes.bar)}>
      <div
        className={clsx(classes.health, classes.fill, {
          [classes.low]: health < 50,
          [classes.critical]: health < 20,
        })}
        style={{ width: `${health}%` }}
      />
    </div>
  );
};
