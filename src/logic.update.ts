import { addSegment, makeInitialSegments } from "./logic.levelGeneration";
import { add, randomBetween } from "./logic.math";
import { GameState } from "./logic.types";

export const updateTitleScreen = ({
  game,
  allPlayerIds,
  dt,
}: {
  game: GameState;
  allPlayerIds: string[];
  dt: number;
}) => {
  if (game.countdown !== undefined) {
    game.countdown -= dt;

    if (game.countdown <= 0) {
      game.phase = "playing";
      game.segments = makeInitialSegments(allPlayerIds, game.settings);
      game.currentSegmentId = game.segments[0].id;
      game.activePlayerId = game.segments[0].owner;
    }
  }
};

export const move = ({ game, dt }: { game: GameState; dt: number }) => {
  const distanceDelta =
    dt *
    (game.settings.STARTING_SPEED +
      (game.currentLevel - 1) * game.settings.SPEED_INCREMENT);

  game.totalDistance += distanceDelta;
  game.currentSegmentDistance += distanceDelta;

  while (
    game.currentSegmentDistance > game.segments[game.currentSegmentId].length
  ) {
    game.currentSegmentDistance -= game.segments[game.currentSegmentId].length;
    game.currentSegmentId++;
  }

  return distanceDelta;
};

export const incrementLevel = ({ game }: { game: GameState }) => {
  if (game.totalDistance >= game.currentLevel * game.settings.LEVEL_LENGTH) {
    game.currentLevel += 1;
    game.currentLevelBackground = `hsl(${Math.round(
      Math.random() * 360
    )}, 40%, 10%)`;
  }
};

export const updateHealth = ({
  game,
  distanceDelta,
}: {
  game: GameState;
  distanceDelta: number;
}) => {
  game.correctPlayerIsInControl =
    game.activePlayerId === game.segments[game.currentSegmentId].owner;

  if (!game.correctPlayerIsInControl && game.health > 0) {
    game.health = Math.max(
      0,
      game.health -
        (game.settings.DAMAGE_PER_DISTANCE +
          game.settings.DAMAGE_INCREASE_PER_LEVEL * (game.currentLevel - 1)) *
          distanceDelta
    );
  } else if (game.correctPlayerIsInControl && game.health < 100) {
    game.health = Math.min(
      100,
      game.health + game.settings.HEAL_PER_DISTANCE * distanceDelta
    );
  }
};

export const checkGameover = ({
  game,
  allPlayerIds,
}: {
  game: GameState;
  allPlayerIds: string[];
}) => {
  if (game.health <= 0) {
    const score = game.currentLevel;

    Rune.gameOver({
      players: Object.fromEntries(allPlayerIds.map((id) => [id, score])),
    });
  }
};

export const updateCallouts = ({ game, t }: { game: GameState; t: number }) => {
  game.callouts = game.callouts.filter(
    ({ createdAt }) => t - createdAt < game.settings.CALLOUTS_DURATION
  );
};

export const expandLevel = ({
  game,
  allPlayerIds,
}: {
  game: GameState;
  allPlayerIds: string[];
}) => {
  let remainingLength = Object.entries(game.segments)
    .filter(([id]) => Number(id) > game.currentSegmentId)
    .reduce((sum, [_, { length }]) => sum + length, 0);

  // add new segments if not enough left
  while (remainingLength < game.settings.SEGMENT_BUFFER_LENGTH) {
    const lastSegmentId = Math.max(...Object.keys(game.segments).map(Number));
    const owner = allPlayerIds[Math.floor(Math.random() * allPlayerIds.length)];
    const newSegment = addSegment(
      game.segments[lastSegmentId],
      owner,
      game.settings
    );

    game.segments[newSegment.id] = newSegment;
    remainingLength += newSegment.length;
  }
};

export const pruneSegments = ({ game }: { game: GameState }) => {
  Object.keys(game.segments)
    .map(Number)
    .filter((id) => id <= game.currentSegmentId - 2)
    .forEach((id) => delete game.segments[id]);
};

export const updateEnemies = ({
  game,
  dt,
}: {
  game: GameState;
  dt: number;
}) => {
  for (const enemy of game.enemies) {
    enemy.lifetime -= dt;

    if (enemy.lifetime <= 0) {
      game.enemies = game.enemies.filter(({ id }) => id !== enemy.id);
      game.health = Math.max(0, game.health - game.settings.ENEMY_DAMAGE);
    }
  }
};

export const spawnEnemies = ({
  game,
  allPlayerIds,
  t,
  dt,
}: {
  game: GameState;
  allPlayerIds: string[];
  t: number;
  dt: number;
}) => {
  game.enemyCountdown -= dt;

  if (game.enemyCountdown > 0) return;

  game.enemyCountdown += Math.max(
    game.settings.ENEMY_COUNTDOWN_MIN,
    game.settings.ENEMY_COUNTDOWN -
      game.currentLevel * game.settings.ENEMY_COUNTDOWN_DECREMENT
  );

  const position = add(
    game.segments[game.currentSegmentId + 1].curveParameters[3],
    [randomBetween(-1, 1), randomBetween(1, 3), 3]
  );

  const positions = [
    position,
    add(position, [
      randomBetween(-0.5, 0.5),
      randomBetween(-0.5, 0.5),
      randomBetween(1, 3),
    ]),
    add(position, [
      randomBetween(-0.5, 0.5),
      randomBetween(-0.5, 0.5),
      randomBetween(4, 6),
    ]),
  ];

  const enemy = {
    id: `${t}`,
    playerId: allPlayerIds[Math.floor(Math.random() * allPlayerIds.length)],
    createdAt: t,
    positions,
    lifetime: game.settings.ENEMY_LIFETIME,
  };

  game.enemies.push(enemy);
};
