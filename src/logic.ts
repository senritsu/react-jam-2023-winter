import type { RuneClient } from "rune-games-sdk/multiplayer";
import { CubicBezierCurve3, Vector3 } from "three";

export type Point = [number, number, number];
export type Segment = {
  id: number;
  owner: string;
  curveParameters: [v0: Point, v1: Point, v2: Point, v3: Point];
  nextSegmentEnd: Point;
  length: number;
};

export interface GameState {
  playerColors: Record<string, string>;
  playerIcons: Record<string, string>;
  callouts: {
    playerId: string;
    createdAt: number;
    position: [number, number];
  }[];
  segments: Segment[];
  totalDistance: number;
  currentLevel: number;
  currentLevelBackground: string;
  currentSegment: Segment;
  currentSegmentDistance: number;
  activePlayerId: string;
  correctPlayerIsInControl: boolean;
  health: number;
  lastT: number;
}

type GameActions = {
  handOverControl: (params: { targetPlayerId: string }) => void;
  requestControl: () => void;
};

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}

const randomBetween = (a: number, b: number) => a + Math.random() * (b - a);

const MIN_SEGMENT_LENGTH = 6;
const MAX_SEGMENT_LENGTH = 20;

const randomNextPathVector = (start: Vector3) =>
  new Vector3(
    (2 * Math.random() - 1) * 2,
    (2 * Math.random() - 1) * 0.5,
    start.z + randomBetween(MIN_SEGMENT_LENGTH, MAX_SEGMENT_LENGTH)
  );

const addSegment = (previousSegment: Segment, owner: string): Segment => {
  // start new segment at previous end point
  const v0 = new Vector3(...previousSegment.curveParameters[3]);
  // calculate a mirrored control point to get a smooth transition
  const v1 = new Vector3(...previousSegment.curveParameters[2]) // start at previous second control point
    .sub(v0) // calculate direction vector from v0 to v1
    .multiplyScalar(-1) // invert
    .add(v0); // back to world space

  const v3 = new Vector3(...previousSegment.nextSegmentEnd);

  const nextSegmentEnd = randomNextPathVector(v3);

  // calculate the control point leading smoothly to the next segment
  const v2 = new Vector3()
    .subVectors(v3, nextSegmentEnd) // get direction vector from end point of next segment to start point of this segment, to get a tangent parallel to it
    .normalize()
    .multiplyScalar(3)
    .add(v3);

  const curve = new CubicBezierCurve3(v0, v1, v2, v3);
  const length = curve.getLength();

  return {
    id: previousSegment.id + 1,
    owner,
    curveParameters: [v0, v1, v2, v3].map((v) => [v.x, v.y, v.z]) as [
      Point,
      Point,
      Point,
      Point
    ],
    nextSegmentEnd: [
      nextSegmentEnd.x,
      nextSegmentEnd.y,
      nextSegmentEnd.z,
    ] as Point,
    length,
  };
};

const getInitializerSegment = (): Segment => {
  const v = randomNextPathVector(new Vector3(0, 0, 0));

  return {
    id: -1,
    owner: "",
    curveParameters: [
      [0, 0, -10],
      [0, 0, -7],
      [0, 0, -3],
      [0, 0, 0],
    ],
    nextSegmentEnd: [v.x, v.y, v.z],
    length: 10,
  };
};

const makeInitialSegments = (allPlayerIds: string[]): Segment[] => {
  const segments = [getInitializerSegment()];

  for (let i = 0; i < 10; i++) {
    segments.push(
      addSegment(
        segments[i],
        allPlayerIds[Math.floor(Math.random() * allPlayerIds.length)]
      )
    );
  }

  return segments.slice(1);
};

// IBM Design Colors, color-blind safe, from https://davidmathlogic.com/colorblind
const COLORS = ["#648FFF", "#785EF0", "#DC267F", "#FE6100", "#FFB000"];
const ICONS = ["sword", "shield", "book", "bow"];

Rune.initLogic({
  minPlayers: 3,
  maxPlayers: 4,
  setup(allPlayerIds) {
    const segments = makeInitialSegments(allPlayerIds);

    return {
      playerColors: Object.fromEntries(
        allPlayerIds.map((id, index) => [id, COLORS[index + 1]])
      ),
      playerIcons: Object.fromEntries(
        allPlayerIds.map((id, index) => [id, ICONS[index]])
      ),
      segments,
      totalDistance: 0,
      currentLevel: 1,
      currentLevelBackground: "hsl(260, 40%, 10%)",
      currentSegment: segments[0],
      currentSegmentDistance: 0,
      activePlayerId: segments[0].owner,
      correctPlayerIsInControl: true,
      health: 100,
      lastT: 0,
      callouts: [],
    };
  },
  actions: {
    handOverControl({ targetPlayerId }, { game, playerId }) {
      if (playerId !== game.activePlayerId) {
        throw Rune.invalidAction();
      }

      game.activePlayerId = targetPlayerId;
    },
    requestControl(_, { game, playerId }) {
      if (playerId === game.activePlayerId) {
        throw Rune.invalidAction();
      }

      game.callouts.push({
        playerId,
        createdAt: Rune.gameTime(),
        position: [Math.random(), Math.random()],
      });
    },
  },
  update: ({ game, allPlayerIds }) => {
    const SEGMENT_BUFFER_LENGTH = 100;
    const STARTING_SPEED = 4;
    const SPEED_INCREMENT = 0.25;
    const LEVEL_LENGTH = 100;
    const DAMAGE_PER_DISTANCE = 3;
    const DAMAGE_INCREASE_PER_LEVEL = 0.1;
    const HEAL_PER_DISTANCE = 0.4;
    const CALLOUTS_DURATION = 1100;

    const t = Rune.gameTime();
    const dt = (t - game.lastT) / 1000;
    game.lastT = t;

    const distanceDelta =
      dt * (STARTING_SPEED + (game.currentLevel - 1) * SPEED_INCREMENT);

    game.totalDistance += distanceDelta;
    game.currentSegmentDistance += distanceDelta;

    if (game.currentSegmentDistance > game.currentSegment.length) {
      const nextSegment = game.segments.find(
        (x) => x.id === game.currentSegment.id + 1
      );

      if (!nextSegment) {
        throw new Error("invalid segment");
      }

      game.currentSegmentDistance -= game.currentSegment.length;
      game.currentSegment = nextSegment;
    }

    game.correctPlayerIsInControl =
      game.activePlayerId === game.currentSegment.owner;

    if (!game.correctPlayerIsInControl && game.health > 0) {
      game.health = Math.max(
        0,
        game.health -
          (DAMAGE_PER_DISTANCE +
            DAMAGE_INCREASE_PER_LEVEL * (game.currentLevel - 1)) *
            distanceDelta
      );
    } else if (game.correctPlayerIsInControl && game.health < 100) {
      game.health = Math.min(
        100,
        game.health + HEAL_PER_DISTANCE * distanceDelta
      );
    }

    if (game.health <= 0) {
      const score = game.currentLevel;

      Rune.gameOver({
        players: Object.fromEntries(allPlayerIds.map((id) => [id, score])),
      });
    }

    game.callouts = game.callouts.filter(
      ({ createdAt }) => t - createdAt < CALLOUTS_DURATION
    );

    let remainingLength = game.segments
      .filter(({ id }) => id > game.currentSegment.id)
      .reduce((sum, { length }) => sum + length, 0);

    // add new segments if not enough left
    while (remainingLength < SEGMENT_BUFFER_LENGTH) {
      const lastSegment = game.segments[game.segments.length - 1];
      const owner =
        allPlayerIds[Math.floor(Math.random() * allPlayerIds.length)];
      const newSegment = addSegment(lastSegment, owner);

      game.segments.push(newSegment);
      remainingLength += newSegment.length;
    }

    if (game.totalDistance >= game.currentLevel * LEVEL_LENGTH) {
      game.currentLevel += 1;
      game.currentLevelBackground = `hsl(${Math.round(
        Math.random() * 360
      )}, 40%, 10%)`;
    }

    // prune old segments
    game.segments = game.segments.filter(
      (x) => x.id > game.currentSegment.id - 2
    );
  },
  updatesPerSecond: 30,
});