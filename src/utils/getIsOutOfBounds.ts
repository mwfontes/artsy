import {TNode} from '../types';

export const getIsOutOfBounds = (node: TNode, width: number, height: number): boolean => {
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
