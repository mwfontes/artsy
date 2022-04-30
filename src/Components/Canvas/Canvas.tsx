import React, { createRef, useRef, useEffect, useCallback, useState } from "react";

import "./Canvas.css";

interface Props {
  width: number;
  height: number;
  baseContext: CanvasRenderingContext2D;
}

type RotationFunction = (deg: number) => number;

type Node = {
  x: number;
  y: number;
  deg: number;
  step: number;
  directionMultiplierX: number;
  directionMultiplierY: number;
  speedRatio: number;
  lineStepLimit: number;
  descendant: number;
  lineWidth: number;
  color: {
    r: number;
    g: number;
    b: number;
  };
  xRotationFunction: RotationFunction;
};

const getBasePixelData = (x: number, y: number, baseContext: CanvasRenderingContext2D) => {
  return baseContext.getImageData(x, y, 1, 1).data;
};

const getIsOutOfBoundsOrFamilyOver = (node: Node, width: number, height: number): boolean => {
  // Out of bounds
  if (node.x > width) {
    return true;
  }
  if (node.x < 0) {
    return true;
  }
  if (node.y > height) {
    return true;
  }
  if (node.y < 0) {
    return true;
  }

  // Family grow is over
  if (node.descendant >= 4) {
    return true;
  }
  if (node.lineWidth <= 2) {
    return true;
  }

  // Should live
  return false;
};

const getXRotationFunction = (): RotationFunction => {
  const randomValue = Math.random();
  if (randomValue <= 0.2) {
    return Math.sin;
  }
  return Math.cos;
};

const getNewNode = (baseContext: CanvasRenderingContext2D, width: number, height: number, node?: Node): Node => {
  const newX = Math.floor(Math.random() * width);
  const newY = Math.floor(Math.random() * height);

  const imagePixelColor = getBasePixelData(node?.x || newX, node?.y || newY, baseContext);

  return {
    x: node?.x || newX,
    y: node?.y || newY,
    deg: Math.random() * 2 * Math.PI,
    step: 0,
    directionMultiplierX: Math.floor(Math.random() * 2) || -1, // -1 or 1
    directionMultiplierY: Math.floor(Math.random() * 2) || -1, // -1 or 1
    speedRatio: Math.random(),
    lineStepLimit: Math.random() * 300,
    descendant: node?.descendant || 0,
    lineWidth: node?.lineWidth || Math.random() * 40 + 40,
    color: {
      r: node?.color.r || imagePixelColor[0],
      g: node?.color.g || imagePixelColor[1],
      b: node?.color.b || imagePixelColor[2],
    },
    xRotationFunction: node?.xRotationFunction || getXRotationFunction(),
  };
};

function Canvas({ width, height, baseContext }: Props) {
  const canvas = createRef<HTMLCanvasElement>();
  // const animationFrame = useRef<any>();
  const ctx = useRef<CanvasRenderingContext2D>();
  const screenRatio = width > height ? height / width : width / height;
  // const [isRunning, setIsRunning] = useState<boolean>(true);
  const nodes = useRef<Node[]>([getNewNode(baseContext, width, height)]);
  const maxBlockNodes = 20;
  const blockNodeInterval = 3;
  const numberOfInteractions = 30000;
  const currentInteraciton = useRef<number>(0);

  const paint = useCallback(() => {
    do {
      // if there's no node, insert the first one
      if (!nodes.current.length) {
        nodes.current = [getNewNode(baseContext, width, height)];
      }

      // for each node, draw the next lines
      nodes.current.forEach((node, i) => {
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

        if (ctx.current) {
          // Modifies node
          const currentColor = getBasePixelData(node.x, node.y, baseContext);

          node = {
            ...node,
            x: x + xRotationFunction(deg) * stepSize * directionMultiplierX,
            y: y + Math.sin(deg) * stepSize * directionMultiplierY,
            deg: deg + (screenRatio * speedRatio) / (Math.sqrt(currentStep + 1) * screenRatio * 3),
            step: currentStep + 1,
          };
          nodes.current[i] = node;

          // Ends line life cycle
          if (getIsOutOfBoundsOrFamilyOver(node, width, height)) {
            nodes.current.splice(i, 1);
          }

          // if life of line has reached its maximum length, insert descendant nodes
          if (node.step >= lineStepLimit) {
            for (let i = 0; i < (node.descendant + 1) * 2; i++) {
              nodes.current.push(
                getNewNode(baseContext, width, height, {
                  ...node,
                  descendant: node.descendant + 1,
                  lineWidth: node.lineWidth / 2,
                  color: {
                    r: currentColor[0],
                    g: currentColor[1],
                    b: currentColor[2],
                  },
                })
              );
            }
            // removes current parent node (lifecycle ended)
            nodes.current.splice(i, 1);
          }

          // Paints on canvas
          ctx.current.beginPath();
          ctx.current.moveTo(x, y); // starting point
          ctx.current.lineTo(node.x, node.y); // end point
          ctx.current.strokeStyle = `rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]})`;
          ctx.current.lineWidth = lineWidth;
          ctx.current.lineCap = "round";
          ctx.current.stroke();

          const correctedBlockNodeInterval = Math.floor((lineWidth / stepSize) * blockNodeInterval);
          if (
            currentStep <= maxBlockNodes * correctedBlockNodeInterval &&
            currentStep % correctedBlockNodeInterval === 0
          ) {
            ctx.current.strokeStyle = `rgba(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]}, 0.25)`;
            ctx.current.lineWidth = lineWidth / 4;
            ctx.current.strokeRect(x - lineWidth * 2, y - lineWidth * 2, lineWidth * 4, lineWidth * 4);
          }
        }
      });
      currentInteraciton.current++;
    } while (currentInteraciton.current <= numberOfInteractions);
  }, [baseContext, width, height, screenRatio]);

  useEffect(() => {
    if (canvas.current) {
      ctx.current = canvas.current?.getContext("2d")!;
      setTimeout(() => {
        paint();
      }, 1000);
    }
  }, [canvas, paint]);

  return <canvas className='canvas' width={width} height={height} ref={canvas} />;
}

export default Canvas;
