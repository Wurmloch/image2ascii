import test from 'ava';
import { ImageHandler } from './image';

test('Image Check Fails', (t) => {
  const pathOne = 'my/custom/path/image.txt';
  const pathTwo = 'my/custom/path/image.jpg';

  t.false(ImageHandler.checkFile(pathOne));
  t.false(ImageHandler.checkFile(pathTwo));
});

test('Image Check Succeeds', (t) => {
  const path = 'src/__test/test-image.jfif';

  t.true(ImageHandler.checkFile(path));
});
