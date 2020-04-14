const yandexApi = require('./yandexApi');

class Controller {
  agents = [];

  constructor(yandexApi) {
    this.yandexApi = yandexApi;
  }



}
const instance = new Controller(yandexApi);
console.log(instance.agents)

module.exports = instance;