const ax = require('axios');

const axios = ax.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

module.exports = function () {
  axios.get('/delete')
    .then(res => res)
    .catch(err => console.log(err));
}