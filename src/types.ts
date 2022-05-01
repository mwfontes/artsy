import {TRotationFunction} from './Components/Canvas/getXRotationFunction';

export interface ICanvas {
  families: number
  width: number;
  height: number;
  baseContext: CanvasRenderingContext2D;
}

export type TNode = {
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
  xRotationFunction: TRotationFunction;
};
