import { existsSync } from 'fs';
import { extname } from 'path';
import Jimp from 'jimp';
import mime from 'mime-types';
import logger from '../logging/logging';

export class ImageHandler {
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
    path: string,
    resizeWidth = 100
  ): Promise<{ pixels: number[][]; image: Jimp } | null> {
    if (await this.checkFile(path)) {
      const originalImage = await Jimp.read(path);
      const resizedImage = originalImage.resize(
        resizeWidth,
        (originalImage.getHeight() / originalImage.getWidth()) * resizeWidth
      );
      const pixels: number[][] = [];
      for (let y = 0; y < resizedImage.getWidth(); y++) {
        const pixelLine = [];
        for (let x = 0; x < resizedImage.getHeight(); x++) {
          pixelLine.push(
            this.rgbaToGrayscale(
              Jimp.intToRGBA(resizedImage.getPixelColor(x, y))
            )
          );
        }
        pixels.push(pixelLine);
      }
      return { pixels, image: resizedImage };
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
    const gamma = 25;
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
    const contentType = mime.lookup(path) as string;
    if (!this.fileContentTypes.includes(contentType)) {
      logger.error(
        `File ${path} is not an accepted image type according to content type ${contentType}`
      );
      return false;
    }
    return true;
  }
}
