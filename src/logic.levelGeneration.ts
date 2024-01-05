import {
  Vector3,
  add,
  copy,
  estimateCurveLength,
  multiplyScalar,
  normalize,
  randomBetween,
  sub,
} from "./logic.math";
import { GameSettings } from "./logic.types";

export type TrackSegment = {
  id: number;
  owner: string;
  curveParameters: [v0: Vector3, v1: Vector3, v2: Vector3, v3: Vector3];
  nextSegmentEnd: Vector3;
  length: number;
};

export type LevelGenerationSettings = Pick<
  GameSettings,
  "MIN_SEGMENT_LENGTH" | "MAX_SEGMENT_LENGTH"
>;

const randomNextPathVector = (
  start: Vector3,
  { MIN_SEGMENT_LENGTH, MAX_SEGMENT_LENGTH }: LevelGenerationSettings
): Vector3 => [
  (2 * Math.random() - 1) * 2,
  (2 * Math.random() - 1) * 0.5,
  start[2] + randomBetween(MIN_SEGMENT_LENGTH, MAX_SEGMENT_LENGTH),
];

export const addSegment = (
  previousSegment: TrackSegment,
  owner: string,
  settings: LevelGenerationSettings
): TrackSegment => {
  // start new segment at previous end point
  const v0 = copy(previousSegment.curveParameters[3]);
  // calculate a mirrored control point to get a smooth transition

  const previousC1Local = sub(previousSegment.curveParameters[2], v0); // calculate direction vector from v0 to v1
  const c1Local = multiplyScalar(previousC1Local, -1);
  const v1 = add(c1Local, v0); // back to world space

  const v3 = copy(previousSegment.nextSegmentEnd);

  const nextSegmentEnd = randomNextPathVector(v3, settings);

  // calculate the control point leading smoothly to the next segment

  const tangentDirection = sub(v3, nextSegmentEnd);
  const rescaledTangent = multiplyScalar(normalize(tangentDirection), 3);
  const v2 = add(rescaledTangent, v3);

  const length = estimateCurveLength([v0, v1, v2, v3], 10);

  return {
    id: previousSegment.id + 1,
    owner,
    curveParameters: [v0, v1, v2, v3],
    nextSegmentEnd,
    length,
  };
};

const getInitializerSegment = (
  settings: LevelGenerationSettings
): TrackSegment => {
  const nextSegmentEnd = randomNextPathVector([0, 0, 0], settings);

  return {
    id: -1,
    owner: "",
    curveParameters: [
      [0, 0, -10],
      [0, 0, -7],
      [0, 0, -3],
      [0, 0, 0],
    ],
    nextSegmentEnd,
    length: 10,
  };
};

export const makeInitialSegments = (
  allPlayerIds: string[],
  settings: LevelGenerationSettings
): TrackSegment[] => {
  const segments = [getInitializerSegment(settings)];

  for (let i = 0; i < 10; i++) {
    segments.push(
      addSegment(
        segments[i],
        allPlayerIds[Math.floor(Math.random() * allPlayerIds.length)],
        settings
      )
    );
  }

  return segments.slice(1);
};
