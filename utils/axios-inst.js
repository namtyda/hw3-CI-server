const axios = require('axios');
const https = require('https');
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

const inst = axios.create({
  baseURL: 'https://hw.shri.yandex/api',
  timeout: 3000,
  headers: { 'Authorization': `Bearer ${process.env.APIKEY}` },
  httpsAgent
});

module.exports = inst;