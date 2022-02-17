import { asciiFullMap, asciiShortMap } from './ascii-map';

export class AsciiHandler {
  public static transformGrayscaleToAscii(
    grayscalePixels: number[],
    full = true
  ): string[] {
    const asciiMap = full ? asciiFullMap : asciiShortMap;
    const asciiChars: string[] = [];
    grayscalePixels.forEach((grayscalePixel) => {
      const percentage = (grayscalePixel / 255) % 1;
      asciiChars.push(asciiMap[Math.floor(percentage * asciiMap.length)]);
    });
    return asciiChars;
  }
}
