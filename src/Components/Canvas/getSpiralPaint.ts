import { getNewSpiralNode } from "./getNewSpiralNode";
import { getBasePixelData } from "../../utils/getBasePixelData";
import { getIsOutOfBounds } from "../../utils/getIsOutOfBounds";
import { getIsFamilyOver } from "../../utils/getIsFamilyOver";

interface ISpiralPaint {
  baseContext: CanvasRenderingContext2D;
  paintContext: CanvasRenderingContext2D;
  width: number;
  height: number;
  screenRatio: number;
  families: number;
}

export const getSpiralPaint = ({
  baseContext,
  paintContext,
  width,
  height,
  screenRatio,
  families,
}: ISpiralPaint) => {
  const initialLineWidth = 100;
  const nodes = [getNewSpiralNode({ baseContext, width, height, lineWidth: initialLineWidth })];
  const maxBlockNodes = 20;
  const blockNodeInterval = 3;
  let currentFamily = 0;

  do {
    // for each node, draw the next lines
    nodes.forEach((node, i) => {
      const {
        x,
        y,
        deg,
        step: currentStep,
        speedRatio,
        lineStepLimit,
        directionMultiplierX,
        directionMultiplierY,
        lineWidth,
        xRotationFunction,
      } = node;
      const stepSize: number = 2 * (1 + deg);

      if (paintContext) {
        // Modifies node
        const currentColor = getBasePixelData(node.x, node.y, baseContext);

        node = {
          ...node,
          x: x + xRotationFunction(deg) * stepSize * directionMultiplierX,
          y: y + Math.sin(deg) * stepSize * directionMultiplierY,
          deg: deg + (screenRatio * speedRatio) / (Math.sqrt(currentStep + 1) * screenRatio * 3),
          step: currentStep + 1,
        };
        nodes[i] = node;

        // Ends line life cycle
        if (getIsOutOfBounds(node, width, height) || getIsFamilyOver(node, width, height)) {
          nodes.splice(i, 1);
          // if there's no node left, insert one again to start over
          if (!nodes.length) {
            nodes.push(
              getNewSpiralNode({
                baseContext,
                width,
                height,
                lineWidth: initialLineWidth - (initialLineWidth / families),
              })
            );
            currentFamily++;
          }
        }

        // if life of line has reached its maximum length, insert descendant nodes
        if (node.step >= lineStepLimit) {
          for (let i = 0; i < (node.descendant + 1) * 2; i++) {
            nodes.push(
              getNewSpiralNode({
                baseContext,
                width,
                height,
                node: {
                  ...node,
                  descendant: node.descendant + 1,
                  lineWidth: node.lineWidth / 2,
                  color: {
                    r: currentColor[0],
                    g: currentColor[1],
                    b: currentColor[2],
                  },
                },
                lineWidth: node.lineWidth / 2,
              })
            );
          }
          // removes current parent node (lifecycle ended)
          nodes.splice(i, 1);
        }

        // Paints on canvas
        paintContext.beginPath();
        paintContext.moveTo(x, y); // starting point
        paintContext.lineTo(node.x, node.y); // end point
        paintContext.strokeStyle = `rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]})`;
        paintContext.lineWidth = lineWidth;
        paintContext.lineCap = "round";
        paintContext.stroke();

        const correctedBlockNodeInterval = Math.floor((lineWidth / stepSize) * blockNodeInterval);
        if (
          currentStep <= maxBlockNodes * correctedBlockNodeInterval &&
          currentStep % correctedBlockNodeInterval === 0
        ) {
          paintContext.strokeStyle = `rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]})`;
          paintContext.lineWidth = lineWidth / 4;
          paintContext.strokeRect(x - lineWidth * 2, y - lineWidth * 2, lineWidth * 4, lineWidth * 4);
        }
      }
    });
  } while (currentFamily <= families);
};
