import { getBasePixelData } from "../../../../utils/getBasePixelData";
import { getNewSlashNode, TSlashNode } from "./getNewSlashNode";

interface ILinePaint {
  baseContext: CanvasRenderingContext2D;
  paintContext: CanvasRenderingContext2D;
  width: number;
  height: number;
  families: number;
  density?: number;
}

export const getSlashPaint = ({ baseContext, paintContext, width, height, families, density = 1 }: ILinePaint) => {
  const lineWidth = width > height ? width / 100 : height / 100;
  let currentFamily = 0;
  let node: TSlashNode = getNewSlashNode({ width, height });

  do {
    const { x1, x2, y1, y2, centerX, centerY } = node;

    const baseColor = getBasePixelData(centerX, centerY, baseContext);

    const segmentColor = {
      r: baseColor[0],
      g: baseColor[1],
      b: baseColor[2],
    };

    paintContext.beginPath();
    paintContext.moveTo(x1, y1);
    paintContext.lineTo(x2, y2);
    paintContext.strokeStyle = `rgba(${segmentColor.r}, ${segmentColor.g}, ${segmentColor.b}, ${density})`;
    paintContext.lineWidth = lineWidth;
    paintContext.lineCap = "round";
    paintContext.stroke();

    node = getNewSlashNode({ width, height });
    currentFamily++;
  } while (currentFamily <= families * 30);
};
