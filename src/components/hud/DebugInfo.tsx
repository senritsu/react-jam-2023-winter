import { useRuneStore } from "../../runeStore";
import classes from "./Hud.module.css";

export const DebugInfo = () => {
  const totalDistance = useRuneStore((state) => state.game.totalDistance);
  const currentSegmentId = useRuneStore((state) => state.game.currentSegmentId);
  const currentSegmentDistance = useRuneStore(
    (state) => state.game.currentSegmentDistance
  );
  const currentLevel = useRuneStore((state) => state.game.currentLevel);

  return (
    <div className={classes.debug}>
      <span>total distance: {totalDistance.toFixed(2)}</span>
      <span>segment distance: {currentSegmentDistance.toFixed(2)}</span>
      <span>segment: {currentSegmentId}</span>
      <span>level: {currentLevel}</span>
    </div>
  );
};
