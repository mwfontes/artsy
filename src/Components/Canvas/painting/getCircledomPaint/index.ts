import Two from 'two.js';
import {LinearGradient} from 'two.js/src/effects/linear-gradient';

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

type TCircle = {
  x: number;
  y: number;
  size: number;
  gradient?: LinearGradient;
  lineWidth?: number;
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
      return 15;
    case EResolution.LOW:
      return 30;
    case EResolution.MEDIUM:
      return 45;
    case EResolution.HIGH:
      return 60;
    case EResolution.VERY_HIGH:
      return 75;
    default:
      return 45;
  }
};

export const getCircledomPaint = ({baseContext, canvas, width, height, resolution}: IHorizontalGradientLines) => {
  if (!canvas) {
    return;
  }

  const mainCircles = [];
  const largeCircles = [];

  const addCircle = ({x, y, size, gradient, lineWidth}: TCircle) => {
    const topXPos = Math.random() > 0.5 ? 0 : 1;
    const bottomXPos = Math.random() > 0.5 ? 0 : 1;
    const colorTop = topXPos === 0 ? getBaseColor(x, y, baseContext) : getBaseColor(x + squareSize, y, baseContext);
    const colorBottom =
      bottomXPos === 0
        ? getBaseColor(x, y + squareSize, baseContext)
        : getBaseColor(x + squareSize, y + squareSize, baseContext);
    const localGradient =
      gradient ||
      new Two.LinearGradient(topXPos, 0, bottomXPos, 1, [
        new Two.Stop(0, `rgb(${colorTop.r}, ${colorTop.g}, ${colorTop.b})`),
        new Two.Stop(1, `rgb(${colorBottom.r}, ${colorBottom.g}, ${colorBottom.b})`),
      ]);

    const circle = canvas.makeCircle(x, y, size);
    circle.noFill();
    circle.stroke = localGradient;
    circle.linewidth = lineWidth || 2;

    return circle;
  };

  // draws main circles
  const squareSize = width / getResolution(resolution);
  for (let ix = 0; ix < width / squareSize; ix++) {
    for (let iy = 0; iy < height / (squareSize * 0.85); iy++) {
      const isEvenRow = iy % 2 === 0;

      if ((ix > 0 && !isEvenRow) || isEvenRow) {
        const x = ix * squareSize;
        const y = iy * (squareSize * 0.85);

        const sizeVariation = (squareSize / 3) * Math.random();

        const circle = isEvenRow
          ? addCircle({x: x + squareSize / 2, y: y + squareSize / 2, size: squareSize / 2 - sizeVariation})
          : addCircle({x, y: y + squareSize / 2, size: squareSize / 2 - sizeVariation});

        mainCircles.push(circle);
      }
    }
  }

  // draws large circles
  const numberOfLargeCircles = 16;
  for (let i = 0; i < numberOfLargeCircles; i++) {
    const referenceCircle = mainCircles[Math.floor(Math.random() * mainCircles.length)];
    const largeSize = referenceCircle.radius * width > height ? height / 10 : width / 10;
    const largeCircle = addCircle({
      x: referenceCircle.translation.x,
      y: referenceCircle.translation.y,
      size: largeSize,
      gradient: referenceCircle.stroke as LinearGradient,
      lineWidth: 4,
    });
    largeCircles.push(largeCircle);
  }
  canvas.update();
};
