import {TVertex} from '../Types';

export const getLinesColliding = (
  line1vertex1: TVertex,
  line1vertex2: TVertex,
  line2vertex1: TVertex,
  line2vertex2: TVertex
): boolean => {
  const determinant =
    (line1vertex2.x - line1vertex1.x) * (line2vertex2.y - line2vertex1.y) -
    (line2vertex2.x - line2vertex1.x) * (line1vertex2.y - line1vertex1.y);

  if (determinant === 0) {
    return false;
  }
  const lambda =
    ((line2vertex2.y - line2vertex1.y) * (line2vertex2.x - line1vertex1.x) +
      (line2vertex1.x - line2vertex2.x) * (line2vertex2.y - line1vertex1.y)) /
      determinant;

  const gamma =
    ((line1vertex1.y - line1vertex2.y) * (line2vertex2.x - line1vertex1.x) +
      (line1vertex2.x - line1vertex1.x) * (line2vertex2.y - line1vertex1.x)) /
      determinant;

  return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
};
