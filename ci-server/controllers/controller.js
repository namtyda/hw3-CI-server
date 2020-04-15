const yandexApi = require('./yandexApi');
const tcp = require('tcp-ping');
const axios = require('axios');

class Controller {
  agents = [{ host: 'localhost', port: 3006 }];
  interval;
  intervalPing;
  builds = [];
  config = {};
  intervalTime = 30000; //msecond
  intervalTimePing = 5000;//msecond
  intervalTimeWork = 5000;//msecond

  constructor(yandexApi) {
    this.yandexApi = yandexApi;
  }

  registerAgent = (req, res) => {
    const { body } = req;
    const { host, port } = body;
    if (host === undefined || port === undefined) {
      return res.status(500).send('bad request');
    }
    this.agents.push = body;
    res.status(200).send('ok');
  };

  sendResultBuild = (req, res) => {
    try {
      const { body } = req;
      this.yandexApi.finishBuild(body)
    } catch (error) {
      console.log(error);
      res.status(500).send('error')
    }
    this.agents.forEach(agent => {
      if (agent.port === body.port && agent.host === body.host) {
        agent.status = true;
      }
    });
    res.status(200).send('ok');
  };

  getBuilds = async () => {
    let response;
    try {
      response = await this.yandexApi.getBuildList();

    } catch (error) {
      console.log(error);
    }
    this.builds = response.data.data
    this.findNewBuilds();
  }

  getConfig = async () => {
    let response;
    let tryCount = 0;
    try {
      response = await this.yandexApi.getConfig();
    } catch (error) {
      console.log(error);
      if (tryCount < 4) {
        response = await this.yandexApi.getConfig();
        tryCount++;
      }
    }

    this.config = { ...this.config, ...response.data.data }
  }

  findNewBuilds = () => {
    this.builds = this.builds.filter(({ status }) => status === 'Waiting');
  }

  checkNewBuilds = async () => {
    this.getBuilds();
    this.interval = setInterval(() => {
      if (this.builds.length === 0) {
        console.log('Запрос за новыми билдами', this.intervalTime);
        this.getBuilds();
      }
    }, this.intervalTime)
  }

  pingAgents = async () => {
    this.intervalPing = setInterval(async () => {
      console.log('Пингую агентов');
      this.agents.forEach(async (agent, i) => {
        const { host, port } = agent;

        tcp.probe(host, port, async (err, alive) => {
          if (err) {
            return console.log(err);
          }
          if (alive) {
            return console.log(alive);
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
        });
      });

    }, this.intervalTimePing)
  }

  prepare = async () => {
    await checkNewBuilds();
    await getConfig();
    await pingAgents();
  }

  start = async () => {
    prepare();
    setInterval(async () => {
      if (this.builds.length !== 0 && this.agents.length !== 0) {
        this.agents.forEach(async agent => {
          if (agent.available) {
            const { host, port } = agent;
            const { id, commitHash } = this.builds.pop();
            const { repoName, buildCommand } = this.config;
            let response;
            try {
              console.log('Послал POST агенту');
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
            if (response.status === 202) {
              сonsole.log('Получил ответ 202, все гуд билдим');
              agent.available = false;
              agent.buildId = id;
            }
          }
        });
      }
    }, this.intervalTimeWork)

  }
}
const instance = new Controller(yandexApi);


module.exports = instance;