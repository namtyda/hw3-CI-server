import ax from 'axios';

const axios = ax.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000,
});

export const api = {
  getConfig() {
    return axios.get('/settings')
      .then(res => res)
      .catch(err => console.log(err));
  },

  getBuildsList(data) {
    return axios.get('/builds', {
      params: {
        limit: data
      }
    })
      .then(res => res)
      .catch(err => console.log(err));
  },

  getDetailsBuild(buildId) {
    return axios.get(`/builds/${buildId}`)
      .then(res => res)
      .catch(err => console.log(err));
  },

  postAddQueue(data) {
    return axios.post(`/builds/${data.commitHash}`, {
      commitMessage: data.commitMessage,
      branchName: data.branchName,
      authorName: data.authorName
    })
      .then(res => res)
      .catch(err => console.log(err));
  },

  getLogs(buildId) {
    return axios.get(`/builds/${buildId}/logs`)
      .then(res => res)
      .catch(err => console.log(err));
  },

  postSaveSettings(data) {

    return axios.post('/settings', {
      repoName: data.repoName,
      buildCommand: data.buildCommand,
      mainBranch: data.mainBranch,
      period: Number(data.period)
    })
      .then(res => res)
      .catch(err => console.log(err));
  }
}
