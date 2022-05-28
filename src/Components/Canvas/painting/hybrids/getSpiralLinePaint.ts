import {getSpiralPaint} from '../getSpiralPaint/getSpiralPaint';
import {getLinePaint} from '../getLinePaint/getLinePaint';

interface IGetSpiralLinePaint {
  baseContext: CanvasRenderingContext2D;
  paintContext: CanvasRenderingContext2D;
  width: number;
  height: number;
  families: number;
  density?: number;
  screenRatio: number;
}

export const getSpiralLinePaint = ({
  baseContext,
  paintContext,
  width,
  height,
  families,
  screenRatio,
}: IGetSpiralLinePaint) => {
  getLinePaint({
    baseContext,
    paintContext,
    families: families / 4,
    width,
    height,
  });
  getSpiralPaint({
    baseContext,
    paintContext,
    families: families / 2,
    screenRatio,
    width,
    height,
  });
  getLinePaint({
    baseContext,
    paintContext,
    families: families / 100,
    width,
    height,
    density: 0.15,
  });
};
