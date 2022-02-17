import { asciiFullMap, asciiShortMap } from './ascii-map';

export class AsciiHandler {
  public static transformGrayscaleToAscii(
    grayscalePixelLines: number[][],
    full = true
  ): string[][] {
    const asciiMap = full ? asciiFullMap : asciiShortMap;
    const asciiPixels: string[][] = [];
    grayscalePixelLines.forEach((grayscalePixelLine) => {
      const asciiPixelLine: string[] = [];
      grayscalePixelLine.forEach((grayscalePixel) => {
        const percentage = (grayscalePixel / 255) % 1;
        asciiPixelLine.push(asciiMap[Math.floor(percentage * asciiMap.length)]);
      });
      asciiPixels.push(asciiPixelLine);
    });
    return asciiPixels;
  }
}
