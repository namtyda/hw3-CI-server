const axios = require('axios');
const https = require('https');
const config = require('../ server-conf.json');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

const inst = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 3000,
  headers: { 'Authorization': `Bearer ${config.apiToken}` },
  httpsAgent
});

module.exports = inst;