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
      const y = Math.floor((height / numberOfRows) * currentRow + height / numberOfRows / 2);
      const numberOfLines = getResolution(resolution);
      const numberOfWiggles = Math.floor(Math.random() * 6 + 4); // from 4 to 12
      for (let currentLine = 0; currentLine < numberOfLines; currentLine++) {
        const rotationAngle = (Math.PI / 8) * Math.cos((Math.PI / numberOfLines) * numberOfWiggles * currentLine);
        const rectangleWidth = (width / numberOfLines) * 1;
        const rectangleHeight =
          (height / numberOfRows) * (Math.abs(Math.sin((currentLine * numberOfWiggles) / numberOfLines)) * 0.6 + 0.4);
        const x = Math.floor((width / numberOfLines) * currentLine + rectangleWidth / 2);
        const colors = [
          getBaseColor(x, y - rectangleHeight / 2, baseContext),
          getBaseColor(x, y + rectangleHeight / 2, baseContext),
        ];
        const gradient = new Two.LinearGradient(0.5, 0, 0.5, 1, [
          new Two.Stop(0, `rgb(${colors[0].r}, ${colors[0].g}, ${colors[0].b})`),
          new Two.Stop(1, `rgb(${colors[1].r}, ${colors[1].g}, ${colors[1].b})`),
        ]);
        gradient.units = 'objectBoundingBox';
        const rectangle = new Two.RoundedRectangle(x, y, rectangleWidth, rectangleHeight, rectangleWidth / 2);
        rectangle.noStroke();
        rectangle.fill = gradient;
        rectangle.opacity = 1 / numberOfPasses;
        rectangle.rotation = rotationAngle;
        canvas.add(rectangle);
      }
    }
  }
  canvas.update();
};
