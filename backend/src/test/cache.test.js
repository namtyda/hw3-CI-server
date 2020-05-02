const { expect } = require('chai');
const { removeRep } = require('../controllers/git');
const { writeLog, readLog } = require('../controllers/cashLog');
const { join } = require('path');
const { PassThrough } = require('stream')


describe('Тесты стрима кэша', function () {
  afterEach(async () => {
    await removeRep(join(__dirname, '../', 'logs', '321-123.cache'))
  });
  it('Тест write stream', async () => {

    const mockReadable = new PassThrough()


    const res = writeLog('321-123', mockReadable)
    setTimeout(() => {
      mockReadable.emit('data', 'beep!')
      mockReadable.emit('data', 'boop!')
      mockReadable.emit('end')
    }, 100)
    expect(await res).to.equal(true);

  })
});

describe('Тесты readSteam', () => {
  it('readStream', async () => {
    const mockReadable = new PassThrough();
    const res = await readLog('referense', mockReadable);
    expect(await res).to.equal(true);
  });
});
