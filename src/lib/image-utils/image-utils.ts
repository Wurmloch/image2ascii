import { readFileSync, existsSync } from 'fs';
import { extname } from 'path';
import logger from '../logging/logging';

export class ImageUtils {
  private static fsOptions = {
    flag: 'r',
  };
  private static fileExtensions = ['.jpg', '.jpeg', '.jfif', '.png'];

  public static readImagePixels(path: string): number[][] | null {
    if (this.checkFile(path)) {
      const file = readFileSync(path, this.fsOptions);
      return [
        [0, 1],
        [2, 3],
      ];
    }
    return null;
  }

  public static checkFile(path: string): boolean {
    return this.fileExists(path) && this.fileHasCorrectExtension(path);
  }

  private static fileExists(path: string): boolean {
    if (!this.fileExtensions.includes(extname(path).toLowerCase())) {
      logger.warn(
        `File ${path} extension is not one of ${this.fileExtensions.join(',')}`
      );
      return false;
    }
    return true;
  }

  private static fileHasCorrectExtension(path: string): boolean {
    if (!existsSync(path)) {
      logger.error(`File ${path} does not exist`);
      return false;
    }
    return true;
  }
}
