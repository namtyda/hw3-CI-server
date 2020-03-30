const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { fileExistsAsync, execAsync } = require('../utils/promisified');


const axios = require('../utils/axios-inst');
const store = {
  lastCommitHash: ''
};

async function removeRep(path) {
  return new Promise( async(resolve, reject) => {
    try {
      await execAsync(`rm -rf ${path}`);
      resolve('deleted');
    } catch (err) {
      reject(err)
    }

  });
}

async function gitClone(userName, repoName, branchName) {
  if (await fileExistsAsync(path.resolve(__dirname, '../', repoName))) {
    await removeRep(path.resolve(__dirname, '../', repoName));
  }
  return new Promise((res, rej) => {
    const git = spawn("git", ["clone", '-b', branchName, `https://github.com/${userName}/${repoName}.git`]);
    git.stderr.on('data', err => {
      console.log(err.toString('UTF-8'));
    });

    git.on('close', async code => {
      console.log(`Это код завершения процесса клона репы ${code}`);
      if (code === 0) {
        res()
      }
      rej();
    });
  });
}

async function gitPull(userName, repoName) {
  if (await fileExistsAsync(path.resolve(__dirname, '../', repoName))) {
    const pull = spawn("git", ["pull", `https://github.com/${userName}/${repoName}.git`], { cwd: path.join(__dirname, '../', repoName) });

    pull.stderr.on('data', err => {
      console.log(err.toString('UTF-8'));
    });

    pull.on('close', code => {
      console.log(`Это завершения процесса пулла репы ${code}`);
    });
  }
}
async function getCommitInfo(repoName, branchName, all = false, switchRepo = false) {
  switchRepo ? store.lastCommitHash = '' : store.lastCommitHash


  if (await fileExistsAsync(path.resolve(__dirname, '../', repoName))) {
    let hashLast = store.lastCommitHash.length > 0 && !all ? store.lastCommitHash + '...HEAD' : '--no-decorate';
    let buff = Buffer.alloc(0);
    let result;
    return new Promise((resolve, rej) => {
      const git = spawn('git', ['log', '--pretty=format:{"commitHash":"%H", "authorName":"%cn", "commitMessage":"%s"}', hashLast], { cwd: path.join(__dirname, '../', repoName) });


      git.stderr.on('data', err => {
        console.log(err.toString('UTF-8'));
      });

      git.stdout.on('data', data => {
        buff = Buffer.concat([buff, data])
      });

      git.on('close', code => {
        console.log(`Это код завершения процесса получения инфы по коммитам ${code}`);
        const str = buff.toString();
        if (str) {
          result = str.split('\n').map((el, i) => JSON.parse(el));
          store.lastCommitHash = result[0].commitHash;
          resolve(result);
        }
        resolve([]);
      });
    });
  }
}

function watcher(interval, repoName, userName, branchName) {
  const intervalMs = interval * 60 * 1000; //msecond
  store.fsWatch = fs.watchFile(path.resolve(__dirname, '../', repoName), file => {
    console.log(repoName, '<=== in this repo, files changed');
  });
  store.intervalWatchId = setInterval(async () => {
    console.log('lol interval', intervalMs, 'msecond');
    if (await fileExistsAsync(path.resolve(__dirname, '../', repoName))) {
      await gitPull(userName, repoName);
      const logCommit = await getCommitInfo(repoName, branchName);
      return compareCommit(logCommit, branchName);
    }
    gitClone(userName, repoName, branchName);
    const logCommit = await getCommitInfo(repoName, branchName);
    compareCommit(logCommit, branchName);
  }, intervalMs);
}

function stopWatcher() {
  if (store.fsWatch) {
    store.fsWatch.stop()
  }

  if (store.intervalWatchId) {
    clearInterval(store.intervalWatchId);
  }
}

async function getBuildList() {
  let responseBuilds;
  try {
    responseBuilds = await axios.get('/build/list', {
      params: {
        offset: 0,
        limit: 25
      }
    });
  } catch (err) {
    console.log(`Ошибка в get запросе к апи за листом билдов ${err}`)
  }
  const { data, status } = responseBuilds;
  if (status !== 200) {
    return console.log(`get запрос листа билдов прилег с кодом ${status}`);
  }
  return data.data;
}

async function compareCommit(commitInfo = [], branchName, isFirst = false) {
  if (isFirst) {
    const { commitMessage, commitHash, authorName } = commitInfo[0];
    let responseQueue;
    try {
      responseQueue = await axios.post('/build/request', {
        commitMessage,
        commitHash,
        branchName,
        authorName
      });

    } catch (err) {
      console.log(`Сервер овтетил ошибкой, на добавление в очередь ${err}`);
    }
    if (responseQueue) {
      const { status } = responseQueue;
      if (status !== 200) {
        return console.log(`Добавление в очередь упало со статусом ${status}`);
      }
      console.log(`Добавили в очередь, со статусом ${status}`);
    }

  } else if (!isFirst && commitInfo.length > 0) {
    const promiseAll = [];
    commitInfo.forEach(async ({ commitMessage, commitHash, authorName }) => {
      promiseAll.push(await axios.post('/build/request', {
        commitMessage,
        commitHash,
        branchName,
        authorName
      }));
      // Почему то если посылать несколько запросов, некоторые падают с 500. Мб стоит ограничение по времени в хранилище.
      Promise.allSettled(promiseAll)
        .then(res => console.log('Добавление задачи успешно'))
        .catch(err => console.log('Ошибка при добавлении задача', err));
    });
  }
}
module.exports = { gitClone, getCommitInfo, compareCommit, getBuildList, stopWatcher, watcher }
