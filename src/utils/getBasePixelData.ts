export const getBasePixelData = (x: number, y: number, baseContext: CanvasRenderingContext2D) => {
  return baseContext.getImageData(x, y, 1, 1).data;
};
