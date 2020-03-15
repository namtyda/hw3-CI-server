const { gitClone, compareCommit, getBuildList, getCommitInfo, stopWatcher, watcher } = require('./git');
const axios = require('../utils/axios-inst');

const store = {}

// Получаю настройки
module.exports.getSettings = async (_, res) => {
  let responseGetSettings;
  try {
    responseGetSettings = await axios.get('/conf');
  } catch (err) {
    res.status(500).send(err);
  }
  const { data, status } = responseGetSettings;

  if (status !== 200) {
    return res.status(500).send('bad request');
  }

  res.send({
    id: data.data.id,
    repoName: data.data.repoName,
    buildCommand: data.data.buildCommand,
    mainBranch: data.data.mainBranch,
    period: data.data.period
  });
}

// Получаю массив со списком билдов
module.exports.getBuilds = async (req, res) => {
  const { params } = req;
  let responseBuilds;

  try {
    responseBuilds = await axios.get('/build/list', {
      params: {
        offset: params.offset || 0,
        limit: params.limit || 25
      }
    });
  } catch (err) {
    return res.status(500).send(err)
  }
  const { data, status } = responseBuilds;

  if (status !== 200) {
    return res.status(500).send('Cant get build list from server');
  }
  res.send(data.data);
}

// Получаю инфу о билде по buildId 
module.exports.getBuildId = async (req, res) => {
  const { params } = req;
  const { buildId } = params;

  if (buildId === undefined) {
    return res.status(400).send('build paramas not defined');
  }
  let responseBuildId;
  try {
    responseBuildId = await axios.get('/build/details', {
      params: {
        buildId
      }
    });

  } catch (err) {
    return res.status(500).send(err);
  }
  const { data, status } = responseBuildId;

  if (status !== 200) {
    return res.status(500)
  }
  res.send(data.data);
}

// Получение логов билда по buildId
module.exports.getLogs = async (req, res) => {
  const { params } = req;
  const { buildId } = params;

  if (buildId === undefined) {
    return res.status(400).send('buildId is not defined');
  }
  let responseLogs;

  try {
    responseLogs = await axios.get('/build/log', {
      params: {
        buildId
      },
      responseType: 'stream'
    });

  } catch (err) {
    return res.status(500).send('server error');
  }
  const { data, status } = responseLogs;

  if (status !== 200) {
    return res.status(500).send('bad server');
  }
  res.send(data)
}

// Добавление в очередь 
module.exports.postAddInstQueue = async (req, res) => {
  const { params, body } = req;
  const { commitHash } = params;

  if (commitHash === undefined) {
    return res.status(400).send('Commit hash in params not valid')
  }
  let responseQueue;
  try {
    responseQueue = await axios.post('/build/request', {
      commitMessage: body.commitMessage,
      commitHash,
      branchName: body.branchName,
      authorName: body.authorName
    });

  } catch (err) {
    return res.status(500).send(err);
  }

  const { status } = responseQueue;
  if (status !== 200) {
    return res.status(500).send('cant add build to queue');
  }
  res.status(200).send('ok');
}

// Сохранение настроек
module.exports.postSettings = async (req, res) => {
  const { body } = req;
  [store.userName, store.repoName] = body.repoName.split('/');
  store.buildCommand = body.buildCommand;
  store.mainBranch = body.mainBranch;
  store.period = body.period;
  let responseSettings;
  try {
    responseSettings = await axios.post('/conf', {
      repoName: body.repoName,
      buildCommand: body.buildCommand,
      mainBranch: body.mainBranch,
      period: body.period
    });

  } catch (err) {
    return res.status(500).send(err);
  }
  const { status } = responseSettings;
  if (status !== 200) {
    return res.status(500).send('bad request or server down');
  }
  stopWatcher();
  const buildList = await getBuildList();
  await gitClone(store.userName, store.repoName);

  store.lastHashCommit = buildList.length > 0 ? buildList[0].commitHash : [];
  console.log(store.lastHashCommit, 'в контролле хэш')

  const list = await getCommitInfo(store.repoName, store.lastHashCommit, store.mainBranch);

  await compareCommit(buildList, list, store.mainBranch);
  console.log(store.repoName, 'repo')
  watcher(store.period, store.repoName, store.userName, store.mainBranch);
  res.status(200).send('ok');
}
