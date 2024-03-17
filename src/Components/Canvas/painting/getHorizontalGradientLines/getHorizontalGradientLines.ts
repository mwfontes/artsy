import Two from 'two.js';

import {getBasePixelData} from '../../../../utils/getBasePixelData';
import {EResolution} from '../../../../Providers/AppSettings/AppSettings';

interface IHorizontalGradientLines {
  baseContext: CanvasRenderingContext2D;
  canvas: Two;
  width: number;
  height: number;
  resolution: EResolution;
}

type TColor = {
  r: number;
  g: number;
  b: number;
};

const getBaseColor = (x: number, y: number, baseContext: CanvasRenderingContext2D): TColor => {
  const newColor = getBasePixelData(x, y, baseContext);
  return {
    r: newColor[0],
    g: newColor[1],
    b: newColor[2],
  };
};

const getResolution = (resolution: EResolution) => {
  switch (resolution) {
    case EResolution.VERY_LOW:
      return 16;
    case EResolution.LOW:
      return 32;
    case EResolution.MEDIUM:
      return 64;
    case EResolution.HIGH:
      return 128;
    case EResolution.VERY_HIGH:
      return 256;
    default:
      return 64;
  }
};

export const getHorizontalGradientLines = ({
  baseContext,
  canvas,
  width,
  height,
  resolution,
}: IHorizontalGradientLines) => {
  if (!canvas) {
    return;
  }

  const numberOfPasses = 1;

  for (let currentPass = 1; currentPass < numberOfPasses + 1; currentPass++) {
    const numberOfRows = currentPass + 1;
    for (let currentRow = 0; currentRow < currentPass + 1; currentRow++) {
      const y = (height / numberOfRows) * currentRow + height / numberOfRows / 2;
      const numberOfLines = getResolution(resolution);
      for (let currentLine = 0; currentLine < numberOfLines; currentLine++) {
        const rotationAngle = (Math.PI / numberOfLines) * currentLine * 3; // PAREI AQUI
        const regtangleWidth = width / numberOfLines;
        const rectangleHeight = height / numberOfRows;
        const x = (width / numberOfLines) * currentLine + regtangleWidth / 2;
        const baseColor = getBaseColor(x, y, baseContext);
        const rectangle = new Two.RoundedRectangle(x, y, regtangleWidth, rectangleHeight, regtangleWidth / 2);
        rectangle.rotation = Math.sin(rotationAngle);
        rectangle.fill = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        rectangle.noStroke();
        canvas.add(rectangle);
      }
    }
  }
  canvas.update();
};
