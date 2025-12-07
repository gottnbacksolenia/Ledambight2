
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

export function analyzeRegions(
  imageData: Uint8Array,
  width: number,
  height: number
): RegionColors {
  // Philips Ambilight tarzı - ekranın kenarlarından renk algılama
  // Kenar bölgelerini %10 kalınlığında ve geniş alandan örnekle
  const edgeThickness = Math.floor(Math.min(width, height) * 0.1);
  
  // Üst kenar - ekranın üst %10'luk kısmından, genişliğin %80'ini kapsayacak şekilde
  const top = getAverageColor(imageData, width, height, {
    x: width * 0.1,
    y: 0,
    width: width * 0.8,
    height: edgeThickness,
  });

  // Alt kenar - ekranın alt %10'luk kısmından, genişliğin %80'ini kapsayacak şekilde
  const bottom = getAverageColor(imageData, width, height, {
    x: width * 0.1,
    y: height - edgeThickness,
    width: width * 0.8,
    height: edgeThickness,
  });

  // Sol kenar - ekranın sol %10'luk kısmından, yüksekliğin %80'ini kapsayacak şekilde
  const left = getAverageColor(imageData, width, height, {
    x: 0,
    y: height * 0.1,
    width: edgeThickness,
    height: height * 0.8,
  });

  // Sağ kenar - ekranın sağ %10'luk kısmından, yüksekliğin %80'ini kapsayacak şekilde
  const right = getAverageColor(imageData, width, height, {
    x: width - edgeThickness,
    y: height * 0.1,
    width: edgeThickness,
    height: height * 0.8,
  });

  // Dominant renk - tüm ekranın ortalaması
  const dominant = getAverageColor(imageData, width, height, {
    x: 0,
    y: 0,
    width: width,
    height: height,
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
