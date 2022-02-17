import { createWriteStream, writeFileSync, existsSync } from 'fs';
import logger from '../logging/logging';

export class Printer {
  constructor(private filename: string, private stretchX = 2) {}

  public async printAsciiPixels(
    pixels: string[],
    width: number,
    height: number
  ): Promise<void> {
    const lines: string[] = [];

    for (let y = 0; y < height; y++) {
      let line = '';
      for (let x = 0; x < width; x++) {
        line += pixels[y * x].repeat(this.stretchX);
      }

      lines.push(line);
    }

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
