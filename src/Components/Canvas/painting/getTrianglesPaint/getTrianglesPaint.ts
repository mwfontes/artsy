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

const getAverageColor = (baseContext: CanvasRenderingContext2D, width: number, height: number, ...points: number[][]) => {
  const colorSum = [0, 0, 0];
  const pixelCount = points.length;
  const imageData = baseContext.getImageData(0, 0, width, height);

  for (const point of points) {
      const [x, y] = point;
      const index = (y * width + x) * 4;
      colorSum[0] += imageData.data[index];
      colorSum[1] += imageData.data[index + 1];
      colorSum[2] += imageData.data[index + 2];
  }

  return colorSum.map(sum => Math.floor(sum / pixelCount));
}

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
  const stepRatio = Math.round(width / height);
  const baseDensity = Math.round(families / 10);
  const centerPoint = {
    x: Math.round(width / 2),
    y: Math.round(height / 2),
  };

  // Build border horizontal vertices
  const xStepSize = Math.round(width / baseDensity);
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

    const averageColor = getAverageColor(baseContext, width, height, p1, p2, p3);
    paintContext.fillStyle = `rgb(${averageColor[0]}, ${averageColor[1]}, ${averageColor[2]})`;
    paintContext.fill();
}

  // Mark vertices on canvas
  vertices.forEach((vertex) => {
    paintContext.beginPath();
    paintContext.arc(vertex.x, vertex.y, 10, 0, 2 * Math.PI);
    paintContext.fillStyle = 'red';
    paintContext.fill();
  });
};
