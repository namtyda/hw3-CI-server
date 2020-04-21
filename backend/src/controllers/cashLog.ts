import { join } from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { getStatAsync, fileExistsAsync, mkDirAsync } from '../utils/promisified';
interface store {
  path: string;
  cacheTime: number;
}
const store: store = {
  path: join(__dirname, '../', '/logs'),
  cacheTime: 5 // minute
};
// Проверяем есть ли лог, и не вышло ли время жизни
async function checkLog(buildId: string) {
  const path: string = join(store.path, buildId + '.cache');
  if (!await fileExistsAsync(path)) {
    console.log('cache file not exists');
    return false;
  }
  const stat = await getStatAsync(path);
  const now = Date.now();
  const cacheLifeTime = store.cacheTime * 60 * 1000; // Перевод в миллисекунды
  return now - stat.mtimeMs <= cacheLifeTime;
}
// Пишем лог
async function writeLog(buildId: string, stream: NodeJS.ReadableStream) {
  return new Promise(async (resolve, reject) => {
    if (!await fileExistsAsync(store.path)) {
      await mkDirAsync(store.path, { recursive: true });
    }
    const writeStream: NodeJS.WritableStream = createWriteStream(join(store.path, buildId + '.cache'), { flags: 'w' });

    stream.pipe(writeStream);

    writeStream.on('close', () => {
      resolve(true);
    });

    writeStream.on('error', (err: Error) => {
      reject(`error write cache ${err.toString()}`);
    });
  });
}
// Читаем лог
async function readLog(buildId: string, stream: NodeJS.WritableStream) {
  return new Promise(async (resolve, reject) => {
    const path: string = join(store.path, buildId + '.cache');

    if (!await fileExistsAsync(path)) {
      resolve(false);
    }

    const readStream: NodeJS.ReadableStream = createReadStream(path);

    readStream.pipe(stream);
    console.log('pipe log readStream');

    readStream.on('close', () => {
      resolve(true);
    });

    readStream.on('error', (err: Error) => {
      reject(`readStream cache down with ${err.toString()}`);
    });
  });
}
export { writeLog, readLog, checkLog };