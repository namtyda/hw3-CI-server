import axios from 'axios';
import https from 'https';
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

const inst = axios.create({
  baseURL: 'https://hw.shri.yandex/api',
  timeout: 3000,
  headers: { 'Authorization': `Bearer ${process.env.APIKEY}` },
  httpsAgent
});

export = inst;