import { TSpiralNode } from "../Components/Canvas/getNewSpiralNode";
import { TLineNode } from "../Components/Canvas/getNewLineNode";

interface IGetIsOutOfBounds {
  node: TSpiralNode | TLineNode;
  width: number;
  height: number;
}

export const getIsOutOfBounds = ({ node, width, height }: IGetIsOutOfBounds): boolean => {
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

  // Should live
  return false;
};
