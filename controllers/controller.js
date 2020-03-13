const axios = require('axios');
const https = require('https');
const { spawn } = require('child_process');
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

const inst = axios.create({
  baseURL: 'https://hw.shri.yandex/api',
  timeout: 1000,
  headers: { 'Authorization': `Bearer ${process.env.APIKEY}` },
  httpsAgent
});

// Получаю настройки
module.exports.getSettings = async (_, res) => {
  let responseGetSettings;
  try {
    responseGetSettings = await inst.get('/conf');
  } catch (err) {
    res.status(500).send(err);
  }
  const { data, status } = responseGetSettings;

  if (status !== 200) {
    return res.status(401).send('bad request');
  }

  res.send({
    id: data.data.id,
    repoName: data.data.repoName,
    buildCommand: data.data.buildCommand,
    mainBranch: data.data.mainBranch,
    period: data.data.period
  });
}

// Получаю список массив со списком билдов
module.exports.getBuilds = async (req, res) => {
  const { params } = req;
  let responseBuilds;

  try {
    responseBuilds = await inst.get('/build/list', {
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

// Получаю инфу о билде по buildID 
module.exports.getBuildId = async (req, res) => {
  const { params } = req;
  const { buildId } = params;

  if (buildId === undefined) {
    return res.status(400).send('build paramas not defined');
  }
  let responseBuildId;
  try {
    responseBuildId = await inst.get('/build/details', {
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

module.exports.getLogs = (req, res) => {
  res.send(`get logs`)
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
    responseQueue = await inst.post('/build/request', {
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
}

// Сохранение настроек
module.exports.postSettings = async (req, res) => {
  const git = spawn("git", ["clone", "https://github.com/necolas/normalize.css.git"]).stdout.pipe(process.stdout);
  const { body } = req;
  let responseSettings;
  try {
    responseSettings = await inst.post('/conf', {
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
    return res.status(401).send('bad request or server down');
  }
}