import { createWriteStream, writeFileSync, existsSync } from 'fs';
import logger from '../logging/logging';

export class Printer {
  constructor(
    private filename: string,
    private stretchX = 3,
    private stretchY = 2
  ) {}

  public async printAsciiPixels(pixels: string[][]): Promise<void> {
    const lines: string[] = [];

    pixels.forEach((pixelLine) => {
      let line = '';
      pixelLine.forEach((pixel) => {
        line += pixel.repeat(this.stretchX);
      });
      for (let i = 0; i < this.stretchY; i++) {
        lines.push(line);
      }
    });

    return new Promise((resolve, reject) => {
      const file = createWriteStream(this.filename);
      file.on('error', (err) => {
        logger.error(err.message);
        reject(err);
      });
      lines.forEach((line) => file.write(line + '\n'));
      file.end();
      resolve();
    });
  }
}
