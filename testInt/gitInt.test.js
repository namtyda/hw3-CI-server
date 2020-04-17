require('dotenv').config();
const { expect } = require('chai');
const axios = require('../utils/axios-inst');
const { fileExistsAsync } = require('../utils/promisified');
const { gitClone, gitPull, getCommitInfo, compareCommit } = require('../controllers/git');
const { join } = require('path');

describe('Интеграционные тесты git', () => {
  it('int: gitClone клонирует репу', async () => {
    const repoName = 'reference';
    const res = await gitClone('namtyda', repoName, 'master');
    expect(true).to.be.equal(await fileExistsAsync(join(__dirname, '../', 'clonesRepo', repoName)));
    expect(res).to.be.equal(0);
  });

  it('int: gitPull корректно пуллит', async () => {
    const repoName = 'reference';
    const res = await gitPull('namtyda', repoName, 'master');
    expect(res).to.be.equal(0);
  });

  it('int: getCommitInfo возвращает массив с коммитами', async () => {
    const repoName = 'reference';
    const res = await getCommitInfo(repoName);
    expect(res[0]).to.be.eql(
      {
        commitHash: 'd36019c43edf53686e07686fc8d5ed78978753ac',
        authorName: 'Andrey Pogorelov',
        commitMessage: 'reference commit for UI test'
      },

    )
  });

  it('int: compareCommit добавляет коммиты', async () => {
    const responseSettings = await axios.post('/conf', {
      repoName: 'test',
      buildCommand: 'npm run build',
      mainBranch: 'master',
      period: 1
    });

    const repoName = 'reference';
    const data = [
      {
        commitHash: '50edd056baf1d984a75b61acdef3f73050ffca49',
        authorName: 'Andrey Pogorelov',
        commitMessage: 'reference commit'
      }
    ];
    const res = await compareCommit(data, 'master', true);
    expect(res).to.be.equal(200);
    expect(responseSettings.status).to.be.equal(200);

  });
});