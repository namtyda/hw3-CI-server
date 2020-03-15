const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { fileExistsAsync } = require('../utils/promisified');
const axios = require('../utils/axios-inst');
const store = {

};

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
async function getCommitInfo(repoName, lastCommitHash, branchName) {
  if (await fileExistsAsync(path.resolve(__dirname, '../', repoName))) {
    console.log(lastCommitHash, 'this is fucking hash')
    let hashLast = lastCommitHash.length > 0 ? lastCommitHash + '...HEAD' : '--no-decorate';
    let buff = Buffer.alloc(0);
    let result;
    return new Promise((resolve, rej) => {
      const git = spawn('git', ['log', '--pretty=format:{"commitHash":"%H", "authorName":"%cn", "commitMessage":"%s"}', hashLast, branchName], { cwd: path.join(__dirname, '../', repoName) });


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
          resolve(result);
        }
        resolve([]);
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
    const buildList = await getBuildList();
    const logCommit = await getCommitInfo(repoName, buildList[0].commitHash, branchName);
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
  console.log(branchName, 'branchchch')
  if (buildList.length === 0) {
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
  } else if (commitInfo.length > 0) {
    const promiseAll = [];
    commitInfo.forEach(({ commitMessage, commitHash, authorName }) => {
      promiseAll.push(axios.post('/build/request', {
        commitMessage,
        commitHash,
        branchName,
        authorName
      }));

      Promise.all(promiseAll)
        .then(res => console.log('Добавление задачи успешно'))
        .catch(err => console.log('Ошибка при добавлении задача', err));
    });
  }
}
module.exports = { gitClone, getCommitInfo, compareCommit, getBuildList, stopWatcher, watcher }

// const log = fs.createWriteStream('../log/log.txt', {flags: 'a'});
// const err = fs.createWriteStream('../log/logErr.txt', {flagscheckCommit: 'a'});
// const ss = spawan(...).stdio: [process.stdin, log, err]

// ss.stdout.pipe(logStream)

//git log -2 --pretty=format:'%H % cn %s'