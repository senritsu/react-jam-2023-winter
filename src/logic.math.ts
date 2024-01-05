export type Point = [number, number, number];
export type Vector3 = Point;

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
