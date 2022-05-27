import { getBasePixelData } from "../../../../utils/getBasePixelData";
import { getNewLineNode, TLineNode } from "../getLinePaint/getNewLineNode";

interface IHorizontalPaint {
  baseContext: CanvasRenderingContext2D;
  paintContext: CanvasRenderingContext2D;
  width: number;
  height: number;
  families: number;
  density?: number;
}

export const getHorizontalPaint = ({
  baseContext,
  paintContext,
  width,
  height,
  families,
  density = 1,
}: IHorizontalPaint) => {
  const lineWidth = height / (families / 5);
  const lineSegmentsSteps = height / width * 5;

  for (let y = 0; y < height; y += lineWidth) {
    let previousX = 0;
    for (
      let x = (Math.random() * width) / (lineSegmentsSteps * 2);
      x < width;
      x += (Math.random() * width) / (lineSegmentsSteps * 2)
    ) {
      const initialColor = getBasePixelData(previousX, y + (lineWidth / 2), baseContext);
      const endColor = getBasePixelData(x, y + (lineWidth / 2), baseContext);
      const segmentColor = {
        r: (initialColor[0] + endColor[0]) / 2,
        g: (initialColor[1] + endColor[1]) / 2,
        b: (initialColor[2] + endColor[2]) / 2,
      };

      paintContext.beginPath();
      paintContext.moveTo(previousX, y + (lineWidth / 2));
      paintContext.lineTo(width, y + (lineWidth / 2));
      paintContext.strokeStyle = `rgba(${segmentColor.r}, ${segmentColor.g}, ${segmentColor.b}, ${density})`;
      paintContext.lineWidth = lineWidth;
      paintContext.lineCap = "round";
      paintContext.stroke();

      previousX = x;
    }
  }
};
