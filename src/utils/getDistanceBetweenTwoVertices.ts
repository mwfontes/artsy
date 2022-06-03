type TVertex = {
  x: number;
  y: number;
}
export const getDistanceBetweenTwoVertices = (a: TVertex, b: TVertex): number => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
