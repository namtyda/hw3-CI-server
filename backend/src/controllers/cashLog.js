const { resolve, join } = require('path');
const { createReadStream, createWriteStream } = require('fs');
const { getStatAsync, fileExistsAsync, mkDirAsync } = require('../utils/promisified');

const store = {
  path: join(__dirname, '../', '/logs'),
  cacheTime: 5 // minute
};
// Проверяем есть ли лог, и не вышло ли время жизни
async function checkLog(buildId) {
  const path = join(store.path, buildId + '.cache');
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
async function writeLog(buildId, stream) {
  return new Promise(async (resolve, reject) => {
    if (!await fileExistsAsync(store.path)) {
      await mkDirAsync(store.path, { recursive: true });
    }
    const writeStream = createWriteStream(join(store.path, buildId + '.cache'), { flags: 'w' });

    stream.pipe(writeStream);

    writeStream.on('close', () => {
      resolve(true);
    });

    writeStream.on('error', err => {
      reject(`error write cache ${err.toString()}`);
    });
  });
}
// Читаем лог
async function readLog(buildId, stream) {
  return new Promise(async (resolve, reject) => {
    const path = join(store.path, buildId + '.cache');

    if (!await fileExistsAsync(path)) {
      resolve(false);
    }

    const readStream = createReadStream(path);

    readStream.pipe(stream);
    console.log('pipe log readStream');

    readStream.on('close', () => {
      resolve(true);
    });

    readStream.on('error', err => {
      reject(`readStream cache down with ${err.toString()}`);
    });
  });
}
module.exports = { writeLog, readLog, checkLog };