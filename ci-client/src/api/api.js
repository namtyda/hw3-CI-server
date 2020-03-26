import ax from 'axios';



const axios = ax.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 3000,
});

export const api = {
  getConfig() {
    return axios.get('/settings')
      .then(response => response)
      .catch(err => console.log(err));
  },

  getBuildsList() {
    return axios.get('/builds')
      .then(response => response)
      .catch(err => console.log(err));
  }
}