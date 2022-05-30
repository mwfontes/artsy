import {getBasePixelData} from '../../../../utils/getBasePixelData';
import {getNewTriangleVertex, TTriangleVertex} from './getNewTriangleVertex';

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
  const vertices = [];
  const stepRatio = Math.round(width / height);
  const baseDensity = families / 16;

  // Build border horizontal vertices
  const xStepSize = width / (baseDensity / stepRatio);
  for (let i = 0; i <= width; i += xStepSize) {
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
  for (let i = 0; i < families; i++) {
    vertices.push(
      getNewTriangleVertex({
        x: Math.random() * (width - xStepSize * 2) + xStepSize,
        y: Math.random() * (height - yStepSize * 2) + yStepSize,
      })
    );
  }

  // Paint vertices
  // vertices.forEach((vertex) => {
  //   paintContext.beginPath();
  //   paintContext.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
  //   paintContext.fillStyle = 'red';
  //   paintContext.fill();
  // });

  // Paint triangles lines
  // vertices.forEach((vertex) => {
  //   paintContext.beginPath();
  //   paintContext.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
  //   paintContext.fillStyle = 'red';
  //   paintContext.fill();
  // });
};
