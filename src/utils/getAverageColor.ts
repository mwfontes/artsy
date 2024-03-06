export const getAverageColor = (baseContext: CanvasRenderingContext2D) => {
  const imageData = baseContext.getImageData(0, 0, baseContext.canvas.width, baseContext.canvas.height).data;

  const blockSize = 50; // only visit every 50 pixels
  const length = imageData.length / 4; // 4 = r, g, b, a = 1 or block/pixel
  let r = 0,
    g = 0,
    b = 0;

  for (let i = 0; i < length; i += blockSize) {
    r += imageData[i * 4];
    g += imageData[i * 4 + 1];
    b += imageData[i * 4 + 2];
  }

  return {
    r: Math.floor(r / (length / blockSize)),
    g: Math.floor(g / (length / blockSize)),
    b: Math.floor(b / (length / blockSize)),
  };
};
