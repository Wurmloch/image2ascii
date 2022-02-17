import { existsSync } from 'fs';
import { extname } from 'path';
import Jimp from 'jimp';
import { Magic, MAGIC_MIME_TYPE } from 'mmmagic';
import logger from '../logging/logging';

export class ImageHandler {
  private static magic = new Magic(MAGIC_MIME_TYPE);
  private static fsOptions = {
    flag: 'r',
  };
  private static fileExtensions = [
    '.jpg',
    '.jpeg',
    '.jpe',
    '.jfif',
    '.png',
    '.bmp',
    '.gif',
    '.tiff',
    '.tif',
  ];
  private static fileContentTypes = [
    'image/jpeg',
    'image/pipeg',
    'image/png',
    'image/gif',
    'image/tiff',
    'image/bmp',
    'image/x-bmp',
    'image/x-ms-bmp',
    'image/vnd.wap.wbmp',
  ];

  public static async readImagePixelsGrayScale(
    path: string
  ): Promise<{ pixels: number[]; image: Jimp } | null> {
    if (await this.checkFile(path)) {
      const image = await Jimp.read(path);
      const pixels: number[] = [];
      for (let y = 0; y < image.getWidth(); y++) {
        for (let x = 0; x < image.getHeight(); x++) {
          pixels.push(
            this.rgbaToGrayscale(Jimp.intToRGBA(image.getPixelColor(x, y)))
          );
        }
      }
      return { pixels, image };
    }
    return null;
  }

  public static async checkFile(path: string): Promise<boolean> {
    return (
      this.fileExists(path) &&
      this.fileHasCorrectExtension(path) &&
      (await this.fileIsImage(path))
    );
  }

  public static rgbaToGrayscale(rgba: {
    r: number;
    g: number;
    b: number;
    a: number;
  }): number {
    const gamma = 100;
    return (
      (0.2126 * rgba.r) ^
      (gamma + 0.7152 * rgba.g) ^
      (gamma + 0.0722 * rgba.b) ^
      gamma
    );
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

  private static async fileIsImage(path: string): Promise<boolean> {
    const fileDetection = (): Promise<string | string[]> =>
      new Promise((resolve, reject) => {
        this.magic.detectFile(path, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });
    const fileDetectionResult = await fileDetection();
    const contentTypes = Array.isArray(fileDetectionResult)
      ? [...fileDetectionResult]
      : [fileDetectionResult];
    for (const contentType of contentTypes) {
      if (!this.fileContentTypes.includes(contentType)) {
        logger.error(
          `File ${path} is not an accepted image type according to content type ${fileDetectionResult}`
        );
        return false;
      }
    }
    return true;
  }
}
