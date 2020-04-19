const yandexApi = require('./yandexApi');
const tcp = require('tcp-ping');
const axios = require('axios');

class Controller {
  agents = [];
  interval;
  intervalPing;
  intervalRequest;
  builds = [];
  config = {};
  intervalTime = 10000; //msecond
  intervalTimePing = 5000;//msecond
  intervalTimeWork = 5000;//msecond

  constructor(yandexApi) {
    this.yandexApi = yandexApi;
  }

  registerAgent = (req, res) => {
    const { body } = req;
    const {port } = body;
    if (req.hostname === undefined || port === undefined) {
      return res.status(500).send('bad request');
    }
    if (this.agents.every(agent => agent.port !== body.port)) {
      this.agents.push({...body, host: req.hostname});
      res.status(200).send('ok');
      console.log(this.agents)
    }
  };

  sendResultBuild = (req, res) => {
    let tryCount = 0;
    const { body } = req;

    try {
      this.yandexApi.finishBuild(body)
    } catch (error) {
      console.log(error);
      if (tryCount < 4) {
        this.yandexApi.finishBuild(body)
        tryCount += 1;
      } else {
        return res.status(500).send('error');
      }
    }
    this.agents.forEach(agent => {
      if (Number(agent.port) === Number(body.port) && agent.host === req.hostname) {
        agent.available = true;
        delete (agent.buildId);
      }
    });
    res.status(200).send('ok');
  };

  getBuilds = async () => {
    let response;
    try {
      response = await this.yandexApi.getBuildList();
      this.builds = response.data.data
      this.findNewBuilds();
    } catch (error) {
      console.log(error);
    }
  }

  getConfig = async (tryCount = 0) => {
    let response;
    try {
      response = await this.yandexApi.getConfig();
      this.config = { ...this.config, ...response.data.data }
    } catch (error) {
      console.log(error);
      if (tryCount < 4) {
        setTimeout(() => {
          return this.getConfig(tryCount + 1);
        }, 5000)
      }
    }

  }

  findNewBuilds = () => {
    this.builds = this.builds.filter(({ status }) => status === 'Waiting');
  }

  checkNewBuilds = async () => {
    this.getBuilds();
    this.interval = setInterval(() => {
      if (this.builds.length === 0) {
        this.getConfig()
        console.log('Запрос за новыми билдами', this.intervalTime);
        this.getBuilds();
      }
    }, this.intervalTime)
  }

  pingAgents = async () => {
    this.intervalPing = setInterval(async () => {
      this.agents.forEach(async (agent, i) => {
        const { host, port } = agent;

        tcp.probe(host, port, async (err, alive) => {
          if (err) {
            return console.log(err);
          }
          if (alive) {
            return;
          }
          console.log(`Пропал коннект между сервером, и агентом. На ${host}:${port} << Агент будет удален из списка`);
          if (agent.buildId) {
            try {
              await this.yandexApi.buildCancel(agent)
            } catch (error) {
              console.log(error);
            }
          }
          this.agents.splice(i, 1);
          console.log(this.agents)
        });
      });

    }, this.intervalTimePing)
  }

  prepare = async () => {
    await this.checkNewBuilds();
    await this.getConfig();
    await this.pingAgents();

  }

  start = async () => {
    this.prepare();
    setInterval(async () => {
      if (this.builds.length !== 0 && this.agents.length !== 0) {
        this.agents.forEach(async agent => {
          if (agent.available && this.builds.length !== 0) {
            const { host, port } = agent;
            const { id, commitHash } = this.builds.pop();
            const { repoName, buildCommand, mainBranch } = this.config;
            let response;
            try {
              console.log(`Послал POST агенту ${host}:${port}`);
              response = await axios.post(`http://${host}:${port}/build`, {
                id,
                commitHash,
                repoName,
                buildCommand,
                mainBranch
              });
            } catch (error) {
              console.log(error);
            }
            console.log(response.status, '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            if (response.status === 202) {
              const tryCount = 0;
              agent.available = false;
              agent.buildId = id;
              try {
                await this.yandexApi.startBuild({ buildId: id, dateTime: new Date() });
              } catch (error) {
                if (tryCount < 4) {
                  await this.yandexApi.startBuild({ buildId: id, dateTime: new Date() });
                  tryCount += 1;
                } else {
                  console.log(error);
                }
              }
            }
          }
        });
      }
    }, this.intervalTimeWork)

  }
}
const instance = new Controller(yandexApi);

module.exports = instance;