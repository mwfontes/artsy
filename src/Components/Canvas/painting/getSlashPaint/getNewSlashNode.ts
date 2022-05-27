import { getXRotationFunction, TRotationFunction } from "../getSpiralPaint/getXRotationFunction";
import { getBasePixelData } from "../../../../utils/getBasePixelData";

export type TSlashNode = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  centerX: number;
  centerY: number;
};

interface ISlashNode {
  width: number;
  height: number;
}

export const getNewSlashNode = ({ width, height }: ISlashNode): TSlashNode => {
  const centerX = Math.floor(Math.random() * width);
  const centerY = Math.floor(Math.random() * height);
  const angle = Math.random() * Math.PI * 2;
  const segmentLength = width > height ? width / 40 : height / 40;

  return {
    x1: centerX - Math.cos(angle) * segmentLength,
    y1: centerY - Math.sin(angle) * segmentLength,
    x2: centerX + Math.cos(angle) * segmentLength,
    y2: centerY + Math.sin(angle) * segmentLength,
    centerX,
    centerY,
  };
};
