export * from './lib/image/image';

import { ImageHandler } from './lib/image/image';
import { AsciiHandler } from './lib/ascii/ascii';
import { Printer } from './lib/printer/printer';
import logger from './lib/logging/logging';

if (process.argv.length >= 3) {
  const args = process.argv.slice(2);
  const printer = new Printer('./output');
  args.forEach((arg) => {
    ImageHandler.readImagePixelsGrayScale(arg).then((img) => {
      if (img) {
        const asciiPixels = AsciiHandler.transformGrayscaleToAscii(img.pixels);
        printer.printAsciiPixels(
          asciiPixels,
          img.image.getWidth(),
          img.image.getHeight()
        );
      }
    });
  });
} else {
  logger.error('Please make sure to state the image path as argument');
}
