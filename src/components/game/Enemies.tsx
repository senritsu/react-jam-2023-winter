import { MutableRefObject } from "react";
import { useRuneStore } from "../../runeStore";
import { Enemy } from "./Enemy";
import { Vector3 } from "three";

export const Enemies = ({
  playerPosition,
}: {
  playerPosition: MutableRefObject<Vector3>;
}) => {
  const enemyIds = useRuneStore((state) =>
    state.game.enemies.map((enemy) => enemy.id)
  );

  return enemyIds.map((enemyId) => (
    <Enemy key={enemyId} enemyId={enemyId} playerPosition={playerPosition} />
  ));
};
