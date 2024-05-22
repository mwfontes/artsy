interface IGetIsOutOfBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  variationRate: number;
}

export const getIsOutOfBounds = ({x, y, width, height, variationRate}: IGetIsOutOfBounds): boolean => {
  const minX = 0 - variationRate * width;
  const minY = 0 - variationRate * height;
  const maxX = width + variationRate * width;
  const maxY = height + variationRate * height;

  // Out of bounds - should die
  if (x < minX || x > maxX || y < minY || y > maxY) {
    return true;
  }

  // Should live
  return false;
};
