const yandexApi = require('./yandexApi');

class Controller {
  agents = [];
  interval;
  builds = [];
  intervalTime = 30000; //msecond
  constructor(yandexApi) {
    this.yandexApi = yandexApi;
  }

  registerAgent = (req, res) => {
    const { body } = req;
    const { host, port } = body;
    if (host === undefined || port === undefined) {
      return res.status(500).send('bad request');
    }
    this.agents.push = body
    
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

  findNewBuilds = () => {
    this.builds = this.builds.filter(({ status }) => status === 'Waiting');
  }

  checkNewBuilds = async () => {
    this.interval = setInterval(() => {
      if (this.builds.length === 0) {
        console.log('Запрос за новыми билдами', this.intervalTime);
        this.getBuilds();
      }
    }, this.intervalTime)
  }
}
const instance = new Controller(yandexApi);


module.exports = instance;