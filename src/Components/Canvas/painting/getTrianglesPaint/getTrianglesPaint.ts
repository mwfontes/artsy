import {getBasePixelData} from '../../../../utils/getBasePixelData';
import {getNewTriangleVertex} from './getNewTriangleVertex';
import {getDistanceBetweenTwoVertices} from '../../../../utils/getDistanceBetweenTwoVertices';
import {TVertex} from '../../../../Types';
import {getClosestVertex} from '../../../../utils/getClosestVertex';

interface ITrianglePaint {
  baseContext: CanvasRenderingContext2D;
  paintContext: CanvasRenderingContext2D;
  width: number;
  height: number;
  families: number;
  density?: number;
}

export const getTrianglesPaint = ({
  baseContext,
  paintContext,
  width,
  height,
  families,
  density = 1,
}: ITrianglePaint) => {
  const vertices: TVertex[] = [];
  const stepRatio = Math.round(width / height);
  const baseDensity = Math.round(families / 10);
  const centerPoint = {
    x: Math.round(width / 2),
    y: Math.round(height / 2),
  };
  const radialsUsedVertices: TVertex[] = [];

  // Build border horizontal vertices
  const xStepSize = Math.round(width / (baseDensity));
  console.log('xStepSize', xStepSize);
  for (let i = 0; i <= width + xStepSize; i += xStepSize) {
    // Top
    vertices.push(getNewTriangleVertex({x: i, y: 0}));
    // Bottom
    vertices.push(getNewTriangleVertex({x: i, y: height}));
  }

  // Build border vertical vertices
  const yStepSize = height / (baseDensity * stepRatio);
  for (let i = yStepSize; i <= height; i += yStepSize) {
    // Left
    vertices.push(getNewTriangleVertex({x: 0, y: i}));
    // Right
    vertices.push(getNewTriangleVertex({x: width, y: i}));
  }

  // Build center random vertices
  for (let i = 0; i < baseDensity * 4; i++) {
    vertices.push(
      getNewTriangleVertex({
        x: Math.random() * (width - xStepSize * 2) + xStepSize,
        y: Math.random() * (height - yStepSize * 2) + yStepSize,
      })
    );
  }

  // Paint vertices
  vertices.forEach((vertex) => {
    paintContext.beginPath();
    paintContext.arc(vertex.x, vertex.y, 10, 0, 2 * Math.PI);
    paintContext.fillStyle = 'red';
    paintContext.fill();
  });

  // builds central triangle
  let minDistanceFound: number;
  let centerVertex: TVertex = vertices[0];
  vertices.forEach((vertex) => {
    const distance = getDistanceBetweenTwoVertices(centerPoint, vertex);
    if (!minDistanceFound || distance < minDistanceFound) {
      minDistanceFound = distance;
      centerVertex = vertex;
    }
  });

  // Connect central vertices
  centerVertex.connectedVertices.push(getClosestVertex({vertices, vertex: centerVertex}));
  centerVertex.connectedVertices.push(
    getClosestVertex({
      vertices,
      vertex: centerVertex,
      maxAngle: Math.PI / 2,
      minAngle: Math.PI / 8,
      compareAngleToVertex: centerVertex.connectedVertices[0],
    })
  );
  radialsUsedVertices.push(...[centerVertex, ...centerVertex.connectedVertices]);

  // Paint center vertex
  paintContext.beginPath();
  paintContext.arc(centerVertex.x, centerVertex.y, 20, 0, 2 * Math.PI);
  paintContext.fillStyle = 'green';
  paintContext.fill();

  // Paint central edges
  centerVertex.connectedVertices.forEach((centerVertexConnectedVerticesEntry) => {
    paintContext.beginPath();
    paintContext.moveTo(centerVertex.x, centerVertex.y);
    paintContext.lineTo(centerVertexConnectedVerticesEntry.x, centerVertexConnectedVerticesEntry.y);
    paintContext.strokeStyle = 'gray';
    paintContext.lineWidth = 8;
    paintContext.stroke();
  });
/*
  // Creates radial connections
  const segmentInitialVertex = getClosestVertex({vertex: centerVertex, vertices, ignoreVertices: radialsUsedVertices});
  radialsUsedVertices.push(segmentInitialVertex);
  let lastConnectedSegmentVertex: TVertex = segmentInitialVertex;
  vertices.forEach((vertex) => {
    const closestRadialVertex = getClosestVertex({
      vertex: centerVertex,
      vertices,
      ignoreVertices: radialsUsedVertices,
      isFollowOrientation: true,
      compareAngleToVertex: lastConnectedSegmentVertex,
      maxAngle: Math.PI / 2,
    });
    lastConnectedSegmentVertex.connectedVertices.push(closestRadialVertex);
    lastConnectedSegmentVertex = closestRadialVertex;
    radialsUsedVertices.push(lastConnectedSegmentVertex);
  });

  // Paint segmentInitialVertex
  paintContext.beginPath();
  paintContext.arc(segmentInitialVertex.x, segmentInitialVertex.y, 20, 0, 2 * Math.PI);
  paintContext.fillStyle = 'orange';
  paintContext.fill();

  // Paint radial lines
  const paintRadialLines = (vertex: TVertex): any => {
    paintContext.beginPath();
    paintContext.moveTo(vertex.x, vertex.y);
    paintContext.lineTo(vertex.connectedVertices[0].x, vertex.connectedVertices[0].y);
    paintContext.strokeStyle = '#aaaaaa';
    paintContext.lineWidth = 4;
    paintContext.stroke();
    if (vertex.connectedVertices.length) {
      return paintRadialLines(vertex.connectedVertices[0]);
    }
    return null;
  };
  paintRadialLines(segmentInitialVertex);
  */
};
