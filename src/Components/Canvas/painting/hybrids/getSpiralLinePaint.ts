import {getSpiralsPaint} from '../getSpiralsPaint/getSpiralsPaint';
import {getGradientLinesPaint} from '../getGradientLinesPaint/getGradientLinesPaint';

interface IGetSpiralLinePaint {
  baseContext: CanvasRenderingContext2D;
  paintContext: CanvasRenderingContext2D;
  width: number;
  height: number;
  families: number;
  density?: number;
  screenRatio: number;
}

export const getSpiralsGradientLinesPaint = ({
  baseContext,
  paintContext,
  width,
  height,
  families,
  screenRatio,
}: IGetSpiralLinePaint) => {
  getGradientLinesPaint({
    baseContext,
    paintContext,
    families: families / 4,
    width,
    height,
  });
  getSpiralsPaint({
    baseContext,
    paintContext,
    families: families / 2,
    screenRatio,
    width,
    height,
  });
  getGradientLinesPaint({
    baseContext,
    paintContext,
    families: families / 100,
    width,
    height,
    density: 0.15,
  });
};
