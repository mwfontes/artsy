export type TRotationFunction = (deg: number) => number;

export const getXRotationFunction = (): TRotationFunction => {
  const randomValue = Math.random();
  if (randomValue <= 0.5) {
    return Math.sin;
  }
  return Math.cos;
};
