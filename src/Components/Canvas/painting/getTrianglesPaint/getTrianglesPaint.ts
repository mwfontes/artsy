// ChatGPT solution chat link:
// https://chat.openai.com/share/63959ce0-e398-481d-8a03-372775557c17

import Delaunator from 'delaunator';

import {getBasePixelData} from '../../../../utils/getBasePixelData';
import {getNewTriangleVertex} from './getNewTriangleVertex';
import {TVertex} from '../../../../Types';

interface ITrianglePaint {
  baseContext: CanvasRenderingContext2D;
  paintContext: CanvasRenderingContext2D;
  width: number;
  height: number;
  families: number;
  density?: number;
}

const getAverageColor = (baseContext: CanvasRenderingContext2D, ...points: number[][]) => {
  const point1ImageData = getBasePixelData(points[0][0], points[0][1], baseContext);
  const point2ImageData = getBasePixelData(points[1][0], points[1][1], baseContext);
  const point3ImageData = getBasePixelData(points[2][0], points[2][1], baseContext);

  const averageRed = Math.round((point1ImageData[0] + point2ImageData[0] + point3ImageData[0]) / 3);
  const averageGreen = Math.round((point1ImageData[1] + point2ImageData[1] + point3ImageData[1]) / 3);
  const averageBlue = Math.round((point1ImageData[2] + point2ImageData[2] + point3ImageData[2]) / 3);

  return [averageRed, averageGreen, averageBlue];
  // return [Math.random() * 255, Math.random() * 255, Math.random() * 255];
};

const getArrayOf2DPoints = (vertices: TVertex[]) => vertices.map((vertex) => [vertex.x, vertex.y]);

export const getTrianglesPaint = ({
  baseContext,
  paintContext,
  width,
  height,
  families,
  density = 1,
}: ITrianglePaint) => {
  const vertices: TVertex[] = [];
  const borderStepSize = Math.round((width * 2 + height * 2) / families * 5);
  const basePointsCloudDensity = Math.round(families / 10);

  // Adds initial vertices on all 4 corners
  vertices.push(getNewTriangleVertex({x: 0, y: 0}));
  vertices.push(getNewTriangleVertex({x: width, y: 0}));
  vertices.push(getNewTriangleVertex({x: 0, y: height}));
  vertices.push(getNewTriangleVertex({x: width, y: height}));

  // Build border horizontal vertices
  for (let i = borderStepSize; i <= width; i += borderStepSize) {
    // Top
    vertices.push(getNewTriangleVertex({x: i, y: 0}));
    // Bottom
    vertices.push(getNewTriangleVertex({x: i, y: height}));
  }

  // Build border vertical vertices
  for (let i = borderStepSize; i <= height; i += borderStepSize) {
    // Left
    vertices.push(getNewTriangleVertex({x: 0, y: i}));
    // Right
    vertices.push(getNewTriangleVertex({x: width, y: i}));
  }

  // Build center random vertices
  for (let i = 0; i < basePointsCloudDensity * 4; i++) {
    vertices.push(
      getNewTriangleVertex({
        x: Math.random() * (width - borderStepSize * 2) + borderStepSize,
        y: Math.random() * (height - borderStepSize * 2) + borderStepSize,
      })
    );
  }

  // Generates triangles
  const points = getArrayOf2DPoints(vertices);
  const delaunatorTriangles = Delaunator.from(points);

  // paints the triangles
  for (let i = 0; i < delaunatorTriangles.triangles.length; i += 3) {
    const p1 = points[delaunatorTriangles.triangles[i]];
    const p2 = points[delaunatorTriangles.triangles[i + 1]];
    const p3 = points[delaunatorTriangles.triangles[i + 2]];

    paintContext.beginPath();
    paintContext.moveTo(p1[0], p1[1]);
    paintContext.lineTo(p2[0], p2[1]);
    paintContext.lineTo(p3[0], p3[1]);
    paintContext.closePath();

    const averageColor = getAverageColor(baseContext, p1, p2, p3);
    paintContext.fillStyle = `rgb(${averageColor[0]}, ${averageColor[1]}, ${averageColor[2]})`;
    paintContext.fill();
  }
};
