import {TNode} from '../types';

export const getIsFamilyOver = (node: TNode, width: number, height: number): boolean => {
  // Family grow is over
  if (node.descendant >= 4) {
    return true;
  }
  // is it too thin already?
  if (node.lineWidth <= 2) {
    return true;
  }

  // Should live
  return false;
};
