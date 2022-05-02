import { getBasePixelData } from "../../utils/getBasePixelData";
import { getNewLineNode, TLineNode } from "./getNewLineNode";

interface ILinePaint {
  baseContext: CanvasRenderingContext2D;
  paintContext: CanvasRenderingContext2D;
  width: number;
  height: number;
  families: number;
}

export const getLinePaint = ({ baseContext, paintContext, width, height, families }: ILinePaint) => {
  const lineWidth = 4;
  const lineSegmentsSteps = 10;
  let currentFamily = 0;
  let node: TLineNode = getNewLineNode({ width, height });

  do {
    const { originX, originY, x: destinationX, y: destinationY } = node;

    if (originX && originY) {
      const xSegment = (destinationX - originX) / lineSegmentsSteps;
      const ySegment = (destinationY - originY) / lineSegmentsSteps;

      const originColor = getBasePixelData(originX, originY, baseContext);
      const destinationColor = getBasePixelData(destinationX, destinationY, baseContext);

      for (let i = 0; i < lineSegmentsSteps; i++) {

        const segmentColor = {
          r: Math.round(originColor[0] + ((destinationColor[0] - originColor[0]) / lineSegmentsSteps) * i),
          g: Math.round(originColor[1] + ((destinationColor[1] - originColor[1]) / lineSegmentsSteps) * i),
          b: Math.round(originColor[2] + ((destinationColor[2] - originColor[2]) / lineSegmentsSteps) * i),
        };

        paintContext.beginPath();
        paintContext.moveTo(originX + xSegment * i, originY + ySegment * i);
        paintContext.lineTo(originX + xSegment * (i + 1), originY + ySegment * (i + 1));
        paintContext.strokeStyle = `rgba(${segmentColor.r}, ${segmentColor.g}, ${segmentColor.b}, 0.25)`;
        paintContext.lineWidth = lineWidth;
        paintContext.lineCap = "round";
        paintContext.stroke();
      }
    }

    node = getNewLineNode({ width, height, originX: destinationX, originY: destinationY });
    currentFamily++;
  } while (currentFamily <= families * 80);
};
