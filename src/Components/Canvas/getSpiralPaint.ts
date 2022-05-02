import { getNewSpiralNode, TSpiralNode } from "./getNewSpiralNode";
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

type TColor = {
  r: number;
  g: number;
  b: number;
}

export const getSpiralPaint = ({ baseContext, paintContext, width, height, screenRatio, families }: ISpiralPaint) => {
  const initialLineWidth = 20;
  const nodes = [getNewSpiralNode({ baseContext, width, height, lineWidth: initialLineWidth })];
  const maxBlockNodes = 20;
  const blockNodeInterval = 3;
  const stepsPerColor = 20;
  let currentFamily = 0;

  const getBaseColor = (node: TSpiralNode): TColor => {
    const {color} = node;
    
    if (node.step % stepsPerColor === 0) {
      const newColor = getBasePixelData(node.x, node.y, baseContext);
      return {
        r: newColor[0],
        g: newColor[1],
        b: newColor[2],
      }
    }

    return color;
  }

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
        const newDeg = deg + screenRatio * speedRatio * (Math.sqrt(currentStep + 1) * screenRatio * 3);
        const newX = x + xRotationFunction(newDeg) * stepSize * directionMultiplierX;
        const newY = y + Math.sin(newDeg) * stepSize * directionMultiplierY;

        const baseColor = getBaseColor(node);

        node = {
          ...node,
          x: newX,
          y: newY,
          step: currentStep + 1,
          color: baseColor,
        };
        nodes[i] = node;

        // Ends line life cycle
        if (getIsOutOfBounds({ node, width, height }) || getIsFamilyOver({ node })) {
          nodes.splice(i, 1);
          // if there's no node left, insert one again to start over
          if (!nodes.length) {
            nodes.push(
              getNewSpiralNode({
                baseContext,
                width,
                height,
                lineWidth: initialLineWidth - initialLineWidth / families,
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
        paintContext.strokeStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        paintContext.lineWidth = lineWidth;
        paintContext.lineCap = "round";
        paintContext.stroke();
        
        // paintContext.beginPath();
        // paintContext.arc(node.originalX, node.originalY, 50, 0, 2 * Math.PI, false);
        // paintContext.fillStyle = `rgb(${segmentColor.r}, ${segmentColor.g}, ${segmentColor.b}, 0.5)`;
        // paintContext.fill();

        // Initial blocks
        const correctedBlockNodeInterval = Math.floor((lineWidth / stepSize) * blockNodeInterval);
        if (
          currentStep <= maxBlockNodes * correctedBlockNodeInterval &&
          currentStep % correctedBlockNodeInterval === 0
        ) {
          paintContext.strokeStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.25)`;
          paintContext.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.5)`;
          paintContext.lineWidth = lineWidth / 4;
          paintContext.fillRect(x - lineWidth * 2, y - lineWidth * 2, lineWidth * 4, lineWidth * 4);
          paintContext.strokeRect(x - lineWidth * 2, y - lineWidth * 2, lineWidth * 4, lineWidth * 4);
        }
      }
    });
  } while (currentFamily <= families);
};
