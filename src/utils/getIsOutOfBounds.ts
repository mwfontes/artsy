interface IGetIsOutOfBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const getIsOutOfBounds = ({x, y, width, height}: IGetIsOutOfBounds): boolean => {
  // Out of bounds - should die
  if (x > width) {
    return true;
  }
  if (x < 0) {
    return true;
  }
  if (y > height) {
    return true;
  }
  if (y < 0) {
    return true;
  }

  // Should live
  return false;
};
