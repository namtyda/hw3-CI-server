const axios = require('../utils/axios-instance');
const config = require('../agent-conf.json');
const tcp = require('tcp-ping');
const { spawn } = require('child_process');
const { join } = require('path');
const { mkDirAsync, fileExistsAsync, execAsync } = require('../utils/utils');

class Agent {
  available = true;
  intervalPing;

  constructor(webClient, config, spawn) {
    this.webClient = webClient;
    this.port = process.argv[2] || config.port;
    this.spawn = spawn;
    this.serverHost = config.serverHost;
    this.serverPort = config.serverPort;
  }
  registry = async (tryCount = 0) => {
    let response;
    try {
      response = await this.webClient.post('/notify-agent', {
        port: Number(this.port),
        available: this.available
      });
    } catch (error) {
      // console.log(error);
      if (tryCount < 4) {
        setTimeout(() => {
          console.log('реконект')
          return this.registry(tryCount + 1);
        }, 5000);
      } else {
        console.log('Не удалось передать данные на процесс сервер, процесс-агент будет убит')
        process.exit();
      }
      return;
    }
    console.log(response.status, 'Зарегались');
  }

  pingServer = () => {
    this.interval = setInterval(() => {
      tcp.probe(this.serverHost, this.serverPort, async (err, alive) => {
        if (err) {
          return console.log(err);
        }
        if (alive) {
          return;
        }
        console.log(`Пропал коннект между сервером, >>> эвакуация`);
        process.exit();
      });
    }, 5000);
  }

  sendResultBuild = async (result, tryCount = 0) => {
    let response;
    try {
      response = await this.webClient.post('/notify-build-result', {
        ...result
      })
    } catch (error) {
      if (tryCount < 4) {
        setTimeout(() => {
          return this.sendResultBuild(result, tryCount + 1)
        }, 5000);
      } else {
        console.log('Не удалось передать данные на процесс сервер, процесс-агент будет убит')
        process.exit();
      }
    }
  }

  removeRepo = (path) => {
    return new Promise(async (resolve, reject) => {
      try {
        await execAsync(`rm -rf ${path}`);
        resolve('deleted');
      } catch (err) {
        reject(err)
      }
    });
  }

  cloneRepo = async ({ branchName, userName, repoName }) => {
    const cwd = join(__dirname, '../', '/clonesRepo', `${this.port}`);

    if (await fileExistsAsync(cwd)) {
      await this.removeRepo(cwd);
      await mkDirAsync(cwd);
    } else {
      await mkDirAsync(cwd);
    }
    const git = this.spawn("git", ["clone", '-b', branchName, `https://github.com/${userName}/${repoName}.git`], { cwd });
    return new Promise(((resolve, reject) => {
      git.on('error', err => reject({
        err: 'ERR_CLONE_REPO',
        errMsg: err.toString(),
      }));
      git.on('close', () => resolve());
    }));
  }

  checkoutRepo = ({ commitHash, repoName }) => {
    const cwd = join(__dirname, '../', '/clonesRepo', `${this.port}`, repoName);

    const git = this.spawn('git', ['checkout', '-q', commitHash], { cwd });
    return new Promise(((resolve, reject) => {
      git.on('error', err => reject({
        err: 'ERR_CHECKOUT_REPO',
        errMsg: err.toString(),
      }));
      git.on('close', () => resolve());
    }));
  }

  build = async ({ id, commitHash, repoName, buildCommand, mainBranch }) => {
    const [userName, repoSitoryName] = repoName.split('/');
    this.available = false;
    const startBuild = new Date();
    try {
      await this.cloneRepo({ branchName: mainBranch, repoName: repoSitoryName, userName });
      await this.checkoutRepo({ commitHash, repoName: repoSitoryName });
    } catch (error) {
      console.log(error);
    }
    const cwd = join(__dirname, '../', '/clonesRepo', `${this.port}`, repoSitoryName);

    const run = this.spawn(buildCommand, [], { cwd: cwd, shell: true })
    console.log(buildCommand)
    let stdout = '';
    let stderr = '';
    return new Promise(resolve => {
      console.log(stderr, stdout)
      run.stdout.on('data', data => {
        stdout += data
        console.log(data.toString())
      });
      run.stderr.on('data', data => stderr += data);

      run.on('error', () => {
        console.log(stderr)
        const finishBuild = new Date();
        this.available = true;
        resolve({
          port: this.port,
          available: this.available,
          buildId: id,
          duration: Math.ceil(((finishBuild - startBuild) / 1000) / 60),
          success: false,
          buildLog: (stdout + stderr) || 'string'
        });
      });

      run.on('close', (status) => {
        const finishBuild = new Date();
        this.available = true;
        resolve({
          port: this.port,
          available: this.available,
          buildId: id,
          duration: Math.ceil(((finishBuild - startBuild) / 1000) / 60),
          success: status === 0,
          buildLog: (stdout + stderr) || 'string'
        });
      });
    });
  }

}

const instance = new Agent(axios, config, spawn);

module.exports = instance;