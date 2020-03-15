const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { fileExistsAsync } = require('../utils/promisified');
const axios = require('../utils/axios-inst');
const store = {

};
const repoName = 'normalize.css';
const userName = 'necolas';

async function gitClone(userName, repoName) {
  if (!await fileExistsAsync(path.resolve(__dirname, '../', repoName))) {
    return new Promise((res, rej) => {
      const git = spawn("git", ["clone", `https://github.com/${userName}/${repoName}.git`]);
      git.stderr.on('data', err => {
        console.log(err.toString('UTF-8'));
      });

      git.on('close', async code => {
        console.log(`Это код завершения процесса клона репы, спавна ${code}`);
        if (code === 0) {
          res()
        }
        rej();
      });
    });
  }

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

async function getCommitInfo(repoName) {
  if (await fileExistsAsync(path.resolve(__dirname, '../', repoName))) {
    let buff = Buffer.alloc(0);
    let result;
    return new Promise((resolve, rej) => {
      const git = spawn('git', ['log', '-1', '--pretty=format:{"commitHash":"%H", "authorName":"%cn", "commitMessage":"%s"}', 'master'], { cwd: path.join(__dirname, '../', repoName) });

      git.stderr.on('data', err => {
        console.log(err.toString('UTF-8'));
      });

      git.stdout.on('data', data => {
        buff = Buffer.concat([buff, data])
      });

      git.on('close', code => {
        console.log(`Это код завершения процесса получения инфы по коммитам ${code}`);
        const arr = buff.toString();
        result = arr.split('\n').map((el, i) => JSON.parse(el));
        resolve(result);
      });
    });
  }
}

function watcher(interval, repoName, userName, branchName) {
  store.fsWatch = fs.watchFile(path.resolve(__dirname, '../', repoName), file => {
    console.log(repoName, 'rep0jae')
  });
  store.intervalWatchId = setInterval(async () => {
    console.log('lol interval');
    await gitPull(userName, repoName);
    const logCommit = await getCommitInfo(repoName);
    const buildList = await getBuildList();
    compareCommit(buildList, logCommit, branchName);
  }, interval);
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

async function compareCommit(buildList, commitInfo, branchName) {
  if (buildList[0].commitHash !== commitInfo[0].commitHash) {
    const { commitMessage, commitHash, authorName } = commitInfo[0];
    let responseQueue;
    try {
      responseQueue = await axios.post('/build/request', {
        commitMessage: commitMessage,
        commitHash: commitHash,
        branchName: branchName,
        authorName: authorName
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
  }
}
module.exports = { gitClone, getCommitInfo, compareCommit, getBuildList, stopWatcher, watcher }

// const log = fs.createWriteStream('../log/log.txt', {flags: 'a'});
// const err = fs.createWriteStream('../log/logErr.txt', {flagscheckCommit: 'a'});
// const ss = spawan(...).stdio: [process.stdin, log, err]

// ss.stdout.pipe(logStream)

//git log -2 --pretty=format:'%H % cn %s'