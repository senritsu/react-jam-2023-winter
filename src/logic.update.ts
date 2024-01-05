import { addSegment, makeInitialSegments } from "./logic.levelGeneration";
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
