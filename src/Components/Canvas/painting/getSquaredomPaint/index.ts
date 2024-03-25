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

export const getSquaredomPaint = ({baseContext, canvas, width, height, resolution}: IHorizontalGradientLines) => {
  if (!canvas) {
    return;
  }

  const addCircle = (x: number, y: number, size: number) => {
    const topXPos = Math.random() > 0.5 ? 0 : 1;
    const bottomXPos = Math.random() > 0.5 ? 0 : 1;
    const colorTop = topXPos === 0 ? getBaseColor(x, y, baseContext) : getBaseColor(x + squareSize, y, baseContext);
    const colorBottom =
      bottomXPos === 0
        ? getBaseColor(x, y + squareSize, baseContext)
        : getBaseColor(x + squareSize, y + squareSize, baseContext);
    const gradient = new Two.LinearGradient(topXPos, 0, bottomXPos, 1, [
      new Two.Stop(0, `rgb(${colorTop.r}, ${colorTop.g}, ${colorTop.b})`),
      new Two.Stop(1, `rgb(${colorBottom.r}, ${colorBottom.g}, ${colorBottom.b})`),
    ]);

    const circle = canvas.makeCircle(x + squareSize / 2, y + squareSize / 2, squareSize / 2 - 2);
    circle.noFill();
    circle.stroke = gradient;
    circle.linewidth = 2;
  };

  const squareSize = width / getResolution(resolution);
  for (let ix = 0; ix < width / squareSize; ix++) {
    for (let iy = 0; iy < height / squareSize + 1; iy++) {
      const isEvenRow = iy % 2 === 0;
      const x = ix * squareSize;
      const y = iy * (squareSize * 0.85);

      const square = isEvenRow
        ? addCircle(x + squareSize / 2, y + squareSize / 2, squareSize / 2 - 2)
        : addCircle(x, y + squareSize / 2, squareSize / 2 - 2);

      // adds one extra circle to the right of the row
      if (ix === width / squareSize - 1) {
        canvas.makeCircle(x + squareSize, y + squareSize / 2, squareSize / 2 - 2);
      }
    }
  }
  canvas.update();
};
