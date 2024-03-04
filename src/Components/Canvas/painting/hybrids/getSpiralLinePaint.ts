import {getSpiralsPaint} from '../getSpiralsPaint/getSpiralsPaint';
import {getGradientLinesPaint} from '../getGradientLinesPaint/getGradientLinesPaint';
import {EResolution} from '../../../../Providers/AppSettings/AppSettings';

interface IGetSpiralLinePaint {
  baseContext: CanvasRenderingContext2D;
  paintContext: CanvasRenderingContext2D;
  width: number;
  height: number;
  resolution: EResolution;
  density?: number;
  screenRatio: number;
}

export const getSpiralsGradientLinesPaint = ({
  baseContext,
  paintContext,
  width,
  height,
  resolution,
  screenRatio,
}: IGetSpiralLinePaint) => {
  getGradientLinesPaint({
    baseContext,
    paintContext,
    resolution,
    width,
    height,
  });
  getSpiralsPaint({
    baseContext,
    paintContext,
    resolution,
    screenRatio,
    width,
    height,
  });
  getGradientLinesPaint({
    baseContext,
    paintContext,
    resolution,
    width,
    height,
    density: 0.15,
  });
};
