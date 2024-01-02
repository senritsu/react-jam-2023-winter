import type { RuneClient } from "rune-games-sdk/multiplayer";
import { CubicBezierCurve3, Vector3 } from "three";

export interface GameState {
  path: [number, number, number][];
  position: number;
  segments: {
    length: number;
    curve: CubicBezierCurve3;
    owner: string;
  }[];
  currentSegment: number;
  currentSegmentPosition: number;
  currentlyInControl: string;
  correctController: boolean;
  health: number;
  lastHealthChangeTimestamp: number;
}

type GameActions = {
  handOverControl: (params: { targetPlayerId: string }) => void;
  requestControl: () => void;
};

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}

const calculateSegmentLengths = (segments: GameState["segments"]) => {
  for (const segment of segments) {
    const curve = new CubicBezierCurve3().copy(segment.curve);
    segment.length = curve.getLength();
  }
};

const getSegment = (game: GameState) => {
  let distance = game.position;

  for (
    let segmentIndex = 0;
    segmentIndex < game.segments.length;
    segmentIndex++
  ) {
    const { length } = game.segments[segmentIndex];

    if (distance > length) {
      distance -= length;
      continue;
    }

    return [segmentIndex, distance / length];
  }

  return [game.segments.length - 1, 1];
};

const generatePath = (segments = 30) => {
  const path = [[0, 0, 0]] as [number, number, number][];

  for (let i = 0; i < segments; i++) {
    const x = (2 * Math.random() - 1) * 2;
    const y = (2 * Math.random() - 1) * 0.5;
    const z = (path[path.length - 1][2] ?? 0) + (3 + Math.random() * 7);

    path.push([x, y, z]);
  }

  return path;
};

const makeSegments = (
  path: [number, number, number][],
  playerIds: string[]
) => {
  const temp1 = new Vector3();
  const temp2 = new Vector3();

  return path.slice(1).map((end, index) => {
    const v1 = new Vector3(...path[index]);
    const v2 = new Vector3(...end);

    const c1 = new Vector3();
    const c2 = new Vector3();

    // first segment
    if (index === 0) {
      c1.set(v1.x, v1.y, v1.z + 3);
    } else {
      const previous = temp1.set(...path[index - 1]);
      const next = v2;

      // vector from previous point to next point, to get a collinear tangent
      temp2.subVectors(next, previous).normalize().multiplyScalar(3);
      c1.set(v1.x + temp2.x, v1.y + temp2.y, v1.z + temp2.z);
    }

    // last segment
    if (index === path.length - 2) {
      c2.set(v2.x, v2.y, v2.z - 3);
    } else {
      const previous = v1;
      const next = temp1.set(...path[index + 2]);

      // vector from previous point to next point, to get a collinear tangent
      temp2.subVectors(previous, next).normalize().multiplyScalar(3);
      c2.set(v2.x + temp2.x, v2.y + temp2.y, v2.z + temp2.z);
    }

    return {
      curve: new CubicBezierCurve3(v1, c1, c2, v2),
      owner: playerIds[Math.floor(Math.random() * playerIds.length)],
      length: 0,
    };
  });
};

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 4,
  setup(players) {
    const path = generatePath();
    const segments = makeSegments(path, players);
    calculateSegmentLengths(segments);

    return {
      path,
      segments,
      position: 0,
      currentSegment: 0,
      currentSegmentPosition: 0,
      currentlyInControl: segments[0].owner,
      correctController: true,
      health: 100,
      lastHealthChangeTimestamp: 0,
    };
  },
  actions: {
    handOverControl({ targetPlayerId }, { game, playerId }) {
      if (playerId !== game.currentlyInControl) {
        throw Rune.invalidAction();
      }

      game.currentlyInControl = targetPlayerId;
    },
    requestControl(_, { game, playerId }) {
      if (playerId === game.currentlyInControl) {
        throw Rune.invalidAction();
      }
    },
  },
  update: ({ game, allPlayerIds }) => {
    const SPEED = 5;
    const DAMAGE_DELAY = 50;
    const HEAL_DELAY = 1000;

    const t = Rune.gameTime();

    game.position = (SPEED * t) / 1000;

    const [segmentIndex, segmentPosition] = getSegment(game);

    game.currentSegment = segmentIndex;
    game.currentSegmentPosition = segmentPosition;
    game.correctController =
      game.currentlyInControl === game.segments[segmentIndex].owner;

    if (
      !game.correctController &&
      game.health > 0 &&
      t - game.lastHealthChangeTimestamp > DAMAGE_DELAY
    ) {
      game.health -= 1;
      game.lastHealthChangeTimestamp = t;
    } else if (
      game.correctController &&
      game.health < 100 &&
      t - game.lastHealthChangeTimestamp > HEAL_DELAY
    ) {
      game.health += 1;
      game.lastHealthChangeTimestamp = t;
    }

    if (game.health <= 0) {
      Rune.gameOver();
    }

    if (
      game.currentSegment === game.segments.length - 1 &&
      game.currentSegmentPosition === 1
    ) {
      Rune.gameOver({
        players: Object.fromEntries(allPlayerIds.map((id) => [id, "WON"])),
      });
    }
  },
  updatesPerSecond: 30,
});
