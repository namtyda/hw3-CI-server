const axios = require('../utils/axios-instance');

class YandexApi {

  constructor(webClient) {
    this.webClient = webClient;
  }


}

const instance = new YandexApi(axios);

module.exports = instance;