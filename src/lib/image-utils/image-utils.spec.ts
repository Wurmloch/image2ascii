import test from 'ava';
import { ImageUtils } from './image-utils';

process.env.NOLOG = 'true';

test('Image Check Fails', (t) => {
  const pathOne = 'my/custom/path/image.txt';
  const pathTwo = 'my/custom/path/image.jpg';

  t.false(ImageUtils.checkFile(pathOne));
  t.false(ImageUtils.checkFile(pathTwo));
});

test('Image Check Succeeds', (t) => {
  const path = 'src/__test/test-image.jfif';

  t.true(ImageUtils.checkFile(path));
});
