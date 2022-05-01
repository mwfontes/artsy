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
  const lineWidth = 50;
  const lineSegmentsSteps = 30;
  let currentFamily = 0;
  let node: TLineNode = getNewLineNode({ width, height });

  do {
    const { originX, originY, x: destinationX, y: destinationY } = node;

    if (originX && originY) {
      const xSegment = (destinationX - originX) / lineSegmentsSteps;
      const ySegment = (destinationY - originY) / lineSegmentsSteps;

      for (let i = 0; i < lineSegmentsSteps; i++) {
        const segmentColor = getBasePixelData(originX + xSegment * i, originY + ySegment * i, baseContext);

        paintContext.beginPath();
        paintContext.moveTo(originX + xSegment * i, originY + ySegment * i);
        paintContext.lineTo(originX + xSegment * (i + 1), originY + ySegment * (i + 1));
        paintContext.strokeStyle = `rgba(${segmentColor[0]}, ${segmentColor[1]}, ${segmentColor[2]}, 1)`;
        paintContext.lineWidth = lineWidth;
        paintContext.lineCap = "round";
        paintContext.stroke();
      }
    }

    node = getNewLineNode({ width, height, originX: destinationX, originY: destinationY });
    currentFamily++;
  } while (currentFamily <= families * 40);
};
