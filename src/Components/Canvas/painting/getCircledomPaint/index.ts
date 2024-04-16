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

  const addShape = ({x, y, size, gradient, lineWidth}: TCircle) => {
    const topXPos = Math.random() > 0.5 ? 0 : 1;
    const bottomXPos = Math.random() > 0.5 ? 0 : 1;
    const isFilled = Math.random() > 0.5;
    const isCircle = Math.random() > 0.5;
    const colorTop = topXPos === 0 ? getBaseColor(x, y, baseContext) : getBaseColor(x + shapeSize, y, baseContext);
    const colorBottom =
      bottomXPos === 0
        ? getBaseColor(x, y + shapeSize, baseContext)
        : getBaseColor(x + shapeSize, y + shapeSize, baseContext);
    const localGradient =
      gradient ||
      new Two.LinearGradient(topXPos, 0, bottomXPos, 1, [
        new Two.Stop(0, `rgb(${colorTop.r}, ${colorTop.g}, ${colorTop.b})`),
        new Two.Stop(1, `rgb(${colorBottom.r}, ${colorBottom.g}, ${colorBottom.b})`),
      ]);

    const shape = isCircle ? canvas.makeCircle(x, y, size) : canvas.makeRectangle(x, y, size * 2, size * 2);
    shape.linewidth = lineWidth || 2;
    if (isFilled) {
      shape.fill = localGradient;
      shape.noStroke();
    } else {
      shape.noFill();
      shape.stroke = localGradient;
    }

    return shape;
  };

  // draws main circles
  const shapeSize = width / getResolution(resolution);
  for (let ix = 0; ix < width / shapeSize; ix++) {
    for (let iy = 0; iy < height / (shapeSize * 0.85); iy++) {
      const isEvenRow = iy % 2 === 0;

      if ((ix > 0 && !isEvenRow) || isEvenRow) {
        const x = ix * shapeSize;
        const y = iy * (shapeSize * 0.85);

        const sizeVariation = (shapeSize / 3) * Math.random();

        const shape = isEvenRow
          ? addShape({x: x + shapeSize / 2, y: y + shapeSize / 2, size: shapeSize / 2 - sizeVariation})
          : addShape({x, y: y + shapeSize / 2, size: shapeSize / 2 - sizeVariation});

        mainCircles.push(shape);
      }
    }
  }
  canvas.update();
};
