import {TVertex} from '../Types';
import {getDistanceBetweenTwoVertices} from './getDistanceBetweenTwoVertices';

interface IClosestVertex {
  vertices: TVertex[];
  vertex: TVertex;
  maxAngle?: number;
  minAngle?: number;
  compareAngleToVertex?: TVertex;
  ignoreVertices?: TVertex[];
  isFollowOrientation?: boolean;
}

const getAngleBetweenEdges = (originVertex: TVertex, connectedVertex1: TVertex, connectedVertex2: TVertex): number => {
  const edgeX1 = connectedVertex1.x - originVertex.x;
  const edgeY1 = connectedVertex1.y - originVertex.y;
  const edgeX2 = connectedVertex2.x - originVertex.x;
  const edgeY2 = connectedVertex2.y - originVertex.y;
  const angleEdge1 = Math.atan2(edgeY1, edgeX1);
  const angleEdge2 = Math.atan2(edgeY2, edgeX2);
  return angleEdge1 - angleEdge2;
};

export const getClosestVertex = ({
  vertices,
  vertex,
  maxAngle = Math.PI,
  minAngle = 0,
  ignoreVertices = [],
  isFollowOrientation,
  compareAngleToVertex,
}: IClosestVertex): TVertex => {
  let closestVertex: TVertex = vertex.connectedVertices.includes(vertices[0]) ? vertices[0] : vertices[1];
  let closestDistance: number = Infinity;
  let angle: number;

  vertices.forEach((verticesEntry) => {
    const angle = compareAngleToVertex
      ? getAngleBetweenEdges(vertex, compareAngleToVertex, verticesEntry)
      : 0;
      if (
        verticesEntry !== vertex &&
        !vertex.connectedVertices.includes(verticesEntry) &&
        Math.abs(angle) <= Math.abs(maxAngle) &&
        Math.abs(angle) >= Math.abs(minAngle) &&
        !ignoreVertices.includes(verticesEntry)
        ) {
      const distance = getDistanceBetweenTwoVertices(verticesEntry, vertex);
      if (distance < closestDistance) {
        closestVertex = verticesEntry;
        closestDistance = distance;
      }
    }
  });

  return closestVertex;
};
