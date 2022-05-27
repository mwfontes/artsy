import { getHorizontalPaint } from "../getHorizontalPaint/getHorizontalPaint";
import { getVerticalPaint } from "../getVerticalPaint/getVerticalPaint";

interface IGetHorizontalVertical {
  baseContext: CanvasRenderingContext2D;
  paintContext: CanvasRenderingContext2D;
  width: number;
  height: number;
  families: number;
  density?: number;
}

export const getHorizontalVerticalPaint = ({
  baseContext,
  paintContext,
  width,
  height,
  families,
}: IGetHorizontalVertical) => {
  getHorizontalPaint({
    baseContext,
    paintContext,
    families,
    width,
    height,
  });
  getVerticalPaint({
    baseContext,
    paintContext,
    families,
    width,
    height,
    density: 0.5,
  });
};
