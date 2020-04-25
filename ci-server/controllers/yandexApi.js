const axios = require('../utils/axios-instance');

class YandexApi {

  constructor(webClient) {
    this.webClient = webClient;
    this.webClient.interceptors.response.use(null, (error) => {
      if (error.config && error.response && error.response.status >= 500) {
        return this.webClient.request(error.config);
      }
      return Promise.reject(error);
    });
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

  finishBuild = ({ buildId, duration, success, buildLog = "string" }) => {
    return this.webClient.post('/build/finish', {
      buildId,
      duration: Number(duration),
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