export type Point = [number, number, number];
export type Vector3 = Point;
export type CubicBezierCurve3 = [
  start: Vector3,
  c1: Vector3,
  c2: Vector3,
  end: Vector3
];

export const randomBetween = (a: number, b: number) =>
  a + Math.random() * (b - a);

export const copy = (v: Vector3): Vector3 => [...v];

export const add = (a: Vector3, b: Vector3): Vector3 => [
  a[0] + b[0],
  a[1] + b[1],
  a[2] + b[2],
];

export const sub = (a: Vector3, b: Vector3): Vector3 => [
  a[0] - b[0],
  a[1] - b[1],
  a[2] - b[2],
];

export const getLength = (a: Vector3): number =>
  Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);

export const normalize = (a: Vector3): Vector3 => {
  const length = getLength(a);

  return [a[0] / length, a[1] / length, a[2] / length];
};

export const multiplyScalar = (a: Vector3, scalar: number): Vector3 => [
  a[0] * scalar,
  a[1] * scalar,
  a[2] * scalar,
];

export const sampleCubicBezierCurve = (
  [v0, v1, v2, v3]: CubicBezierCurve3,
  t: number
): Vector3 => {
  // powers of t
  const t2 = t * t;
  const t3 = t2 * t;

  // powers of inverse t
  const it = 1 - t;
  const it2 = it * it;
  const it3 = it2 * it;

  return [
    it3 * v0[0] + 3 * it2 * t * v1[0] + 3 * it * t2 * v2[0] + t3 * v3[0],
    it3 * v0[1] + 3 * it2 * t * v1[1] + 3 * it * t2 * v2[1] + t3 * v3[1],
    it3 * v0[2] + 3 * it2 * t * v1[2] + 3 * it * t2 * v2[2] + t3 * v3[2],
  ];
};

export const estimateCurveLength = (curve: CubicBezierCurve3, samples = 10) => {
  let length = 0;

  for (let i = 0; i < samples; i++) {
    const t = i / samples;
    const nextT = (i + 1) / samples;

    const a = sampleCubicBezierCurve(curve, t);
    const b = sampleCubicBezierCurve(curve, nextT);

    length += getLength(sub(b, a));
  }

  return length;
};
