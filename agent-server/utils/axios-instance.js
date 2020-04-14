const axios = require('axios');
const config = require('../agent-conf.json');

const inst = axios.create({
  baseURL: `${config.serverHost}:${config.serverPort}`,
  timeout: 3000,
});

module.exports = inst;