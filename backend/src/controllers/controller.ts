import dotenv from 'dotenv'
dotenv.config();
import { gitClone, compareCommit, getCommitInfo, stopWatcher, watcher } from './git';
const { writeLog, readLog, checkLog } = require('./cashLog');
import axios from '../utils/axios-inst'
import { getConfig, getBuilds, Status, addQueueBody, saveSettings } from '../routers/router';
import { Response, Request } from 'express-serve-static-core';
interface store {
  first: boolean;
  mainBranch: string;
  repoName: string;
  period: number;
  buildCommand?: string;
  userName: string;
}
const store: store = {
  first: true,
  repoName: '',
  mainBranch: '',
  period: 1,
  buildCommand: '',
  userName: ''
}


// Получаю настройки
const getSettings = async (_: Request, res: Response<getConfig | string>) => {
  let responseGetSettings;
  try {
    responseGetSettings = await axios.get('/conf');
  } catch (err) {
    console.log(err);
    res.status(500).send(err.toString());
  }
  if (responseGetSettings) {
    const { data, status } = responseGetSettings;

    if (status !== 200) {
      return res.status(500).send('bad request');
    }
    if ('data' in data) {
      return res.status(200).send({
        id: data.data.id,
        repoName: data.data.repoName,
        buildCommand: data.data.buildCommand,
        mainBranch: data.data.mainBranch,
        period: data.data.period
      });
    }
    res.status(204).send('no content');
  }
}

// Получаю массив со списком билдов
const getBuilds = async (req: Request, res: Response<Array<getBuilds<Status>> | string>) => {
  const { query } = req;
  let responseBuilds;
  try {
    responseBuilds = await axios.get<getBuilds<Status>>('/build/list', {
      params: {
        offset: query.offset || 0,
        limit: query.limit || 25
      }
    });
  } catch (err) {
    return res.status(500).send(err.toString())
  }
  const { data, status } = responseBuilds;

  if (status !== 200) {
    return res.status(500).send('Cant get build list from server');
  }
  res.status(200).send(data.data);
}

// Получаю инфу о билде по buildId 
const getBuildId = async (req: Request, res: Response<Array<getBuilds<Status>> | string>) => {
  const { params } = req;
  const { buildId } = params;


  if (buildId === undefined) {
    return res.status(400).send('build paramas not defined');
  }
  let responseBuildId;
  try {
    responseBuildId = await axios.get<getBuilds<Status>>('/build/details', {
      params: {
        buildId
      }
    });

  } catch (err) {
    return res.status(500).send('error on request server');
  }
  const { data, status } = responseBuildId;

  if (status !== 200) {
    return res.status(500)
  }
  res.status(200).send(data.data);
}

// Получение логов билда по buildId
const getLogs = async (req: Request, res: Response<string>) => {
  const { params } = req;
  const { buildId } = params;

  if (buildId === undefined) {
    return res.status(400).send('buildId is not defined');
  }

  let responseLogs;

  try {
    if (await checkLog(buildId)) {
      console.log('cache exist')
      return await readLog(buildId, res);
    }
    console.log('Запрос логов');
    responseLogs = await axios.get<string>('/build/log', {
      params: {
        buildId
      },
      responseType: 'stream'
    });

    const { data } = responseLogs;
    await writeLog(buildId, data);
    await readLog(buildId, res);

  } catch (err) {
    return res.status(500).send('server error');
  }
}

// Добавление в очередь 
const postAddInstQueue = async (req: Request, res: Response<addQueueBody | string>) => {
  const allCommits: Array<addQueueBody> = await getCommitInfo(store.repoName, store.mainBranch, true);
  const { params, body } = req;
  const { commitHash } = params;

  if (commitHash === undefined) {
    return res.status(400).send('Commit hash in params not valid')
  }
  const searchedCommits = allCommits.find(data => data.commitHash === commitHash);
  let responseQueue;
  try {
    responseQueue = await axios.post('/build/request', {
      commitMessage: searchedCommits?.commitMessage,
      commitHash,
      branchName: store.mainBranch,
      authorName: searchedCommits?.authorName
    });

  } catch (err) {
    return res.status(500).send(err);
  }

  const { status, data } = responseQueue;
  if (status !== 200) {
    return res.status(500).send('cant add build to queue');
  }
  res.status(200).send(data.data);
}

// Сохранение настроек
const postSettings = async (req: Request, res: Response<saveSettings | string>) => {
  const { body } = req;
  [store.userName, store.repoName] = body.repoName.split('/');
  store.buildCommand = body.buildCommand;
  store.mainBranch = body.mainBranch;
  store.period = body.period;
  console.log(body)
  let responseSettings;
  try {
    responseSettings = await axios.post('/conf', {
      repoName: body.repoName,
      buildCommand: body.buildCommand,
      mainBranch: body.mainBranch,
      period: body.period
    });

  } catch (err) {
    return res.status(500).send(err.toString());
  }
  const { status } = responseSettings;
  if (status !== 200) {
    return res.status(500).send('bad request or server down');
  }
  stopWatcher();
  await gitClone(store.userName, store.repoName, store.mainBranch);
  const list = await getCommitInfo(store.repoName, store.mainBranch, false, true);
  await compareCommit(list, store.mainBranch, store.first);
  watcher(store.period, store.repoName, store.userName, store.mainBranch);
  res.status(200).send('ok');
}

export { postSettings, postAddInstQueue, getLogs, getBuildId, getSettings, getBuilds }