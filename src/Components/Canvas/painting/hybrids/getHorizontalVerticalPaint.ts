import {getHorizontalLinesPaint} from '../getHorizontalLinesPaint/getHorizontalLinesPaint';
import {getVerticalLinesPaint} from '../getVerticalLinesPaint/getVerticalLinesPaint';

interface IGetHorizontalVertical {
  baseContext: CanvasRenderingContext2D;
  paintContext: CanvasRenderingContext2D;
  width: number;
  height: number;
  families: number;
  density?: number;
}

export const getHorizontalVerticalLinesPaint = ({
  baseContext,
  paintContext,
  width,
  height,
  families,
}: IGetHorizontalVertical) => {
  getHorizontalLinesPaint({
    baseContext,
    paintContext,
    families,
    width,
    height,
  });
  getVerticalLinesPaint({
    baseContext,
    paintContext,
    families,
    width,
    height,
    density: 0.5,
  });
};
