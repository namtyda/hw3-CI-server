const axios = require('../utils/axios-instance');

class YandexApi {

  constructor(webClient) {
    this.webClient = webClient;
  }

  getBuildList = () => {
    return this.webClient.get('/build/list', {
      params: {
        limit: 100,
      }
    }).catch(err => console.log(err));
  };

  startBuild = ({ buildId, dateTime }) => {
    return this.webClient.post('/build/start', {
      buildId,
      dateTime
    }).catch(err => console.log(err));
  };

  finishBuild = ({ buildId, duration, success, buildLog }) => {
    return this.webClient.post('/build/finish', {
      buildId,
      duration,
      success,
      buildLog
    }).catch(err => console.log(err));
  };

  buildCancel = ({ buildId }) => {
    return this.webClient.post('/build/cancel', {
      buildId
    }).catch(err => console.log(err));
  };

  getConfig = () => {
    return this.webClient.get('/conf')
      .catch(err => console.log(err));
  };

}

const instance = new YandexApi(axios);

module.exports = instance;