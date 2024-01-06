import { useRuneStore } from "../../runeStore";
import { LevelSegment } from "./LevelSegment";

export const Level = () => {
  const segmentIds = useRuneStore((state) =>
    Object.keys(state.game.segments).filter(
      (id) => state.game.segments[Number(id)]
    )
  );

  return segmentIds.map((id) => {
    return <LevelSegment key={id} segmentId={Number(id)} />;
  });
};
