
export interface RegionColors {
  top: string;
  right: string;
  bottom: string;
  left: string;
  dominant: string;
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export function getAverageColor(
  imageData: Uint8Array,
  width: number,
  height: number,
  region: { x: number; y: number; width: number; height: number }
): string {
  let r = 0,
    g = 0,
    b = 0,
    count = 0;

  const startX = Math.floor(region.x);
  const startY = Math.floor(region.y);
  const endX = Math.min(width, startX + Math.floor(region.width));
  const endY = Math.min(height, startY + Math.floor(region.height));

  for (let y = startY; y < endY; y += 2) {
    for (let x = startX; x < endX; x += 2) {
      const idx = (y * width + x) * 4;
      r += imageData[idx];
      g += imageData[idx + 1];
      b += imageData[idx + 2];
      count++;
    }
  }

  if (count === 0) return "#000000";

  return rgbToHex(r / count, g / count, b / count);
}

export interface CropCorners {
  topLeft: { x: number; y: number };
  topRight: { x: number; y: number };
  bottomLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
}

export function analyzeRegions(
  imageData: Uint8Array,
  width: number,
  height: number,
  cropCorners?: CropCorners | null
): RegionColors {
  let cropX = 0;
  let cropY = 0;
  let cropWidth = width;
  let cropHeight = height;

  if (cropCorners) {
    const minX = Math.min(cropCorners.topLeft.x, cropCorners.bottomLeft.x);
    const maxX = Math.max(cropCorners.topRight.x, cropCorners.bottomRight.x);
    const minY = Math.min(cropCorners.topLeft.y, cropCorners.topRight.y);
    const maxY = Math.max(cropCorners.bottomLeft.y, cropCorners.bottomRight.y);

    cropX = Math.floor(minX * width);
    cropY = Math.floor(minY * height);
    cropWidth = Math.floor((maxX - minX) * width);
    cropHeight = Math.floor((maxY - minY) * height);
  }

  const edgeThickness = Math.floor(Math.min(cropWidth, cropHeight) * 0.1);
  
  const top = getAverageColor(imageData, width, height, {
    x: cropX + cropWidth * 0.1,
    y: cropY,
    width: cropWidth * 0.8,
    height: edgeThickness,
  });

  const bottom = getAverageColor(imageData, width, height, {
    x: cropX + cropWidth * 0.1,
    y: cropY + cropHeight - edgeThickness,
    width: cropWidth * 0.8,
    height: edgeThickness,
  });

  const left = getAverageColor(imageData, width, height, {
    x: cropX,
    y: cropY + cropHeight * 0.1,
    width: edgeThickness,
    height: cropHeight * 0.8,
  });

  const right = getAverageColor(imageData, width, height, {
    x: cropX + cropWidth - edgeThickness,
    y: cropY + cropHeight * 0.1,
    width: edgeThickness,
    height: cropHeight * 0.8,
  });

  const dominant = getAverageColor(imageData, width, height, {
    x: cropX,
    y: cropY,
    width: cropWidth,
    height: cropHeight,
  });

  return { top, right, bottom, left, dominant };
}

export function generateMockColors(): RegionColors {
  const randomColor = () =>
    rgbToHex(
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256)
    );

  return {
    top: randomColor(),
    right: randomColor(),
    bottom: randomColor(),
    left: randomColor(),
    dominant: randomColor(),
  };
}
