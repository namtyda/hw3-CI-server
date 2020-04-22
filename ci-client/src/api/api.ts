import ax from 'axios';

const axios = ax.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

export interface addQueue {
  commitHash: string;
}
export interface responseAddQueue {
  commitMessage: string;
  commitHash: string;
  branchName: string;
  authorName: string;
}

export interface Config {
  repoName: string;
  buildCommand: string;
  mainBranch: string;
  period: number;
}
export enum Status {
  Waiting = 'Waiting',
  InProgress = 'InProgress',
  Success = 'Success',
  Fail = 'Fail',
  Canceled = 'Canceled'
}
export interface getBuilds<T> {
  id: string;
  configurationId: string;
  buildNumber: number;
  commitMessage: string;
  commitHash: string;
  branchName: string;
  authorName: string;
  status: T;
  start: string;
  duration: number;

}

export interface getConfig {
  id: string;
  repoName: string;
  buildCommand: string;
  mainBranch: string;
  period: number;
}

export const api = {
  getConfig() {
    return axios.get<getConfig>('/settings')
      .then(res => res)
      .catch(err => {
        console.log(err);
        return err;
      });
  },
  getBuildsList(data: number) {
    return axios.get<getBuilds<Status>>('/builds', {
      params: {
        limit: data
      }
    })
      .then(res => res)
      .catch(err => {
        console.log(err);
        return err;
      });
  },

  getDetailsBuild(buildId: string) {
    return axios.get<getBuilds<Status>>(`/builds/${buildId}`)
      .then(res => {
        return res;
      })
      .catch(err => {
        console.log(err)
        return err;
      });
  },

  postAddQueue(data: addQueue) {
    return axios.post<responseAddQueue>(`/builds/${data.commitHash}`, {
      timeout: 200000
    })
      .then(res => res)
      .catch(err => err);
  },

  getLogs(buildId: string) {
    return axios.get(`/builds/${buildId}/logs`)
      .then(res => res)
      .catch(err => {
        console.log(err)
        return err;
      });
  },

  postSaveSettings(data: Config) {
    return axios.post('/settings', {
      repoName: data.repoName,
      buildCommand: data.buildCommand,
      mainBranch: data.mainBranch,
      period: Number(data.period)
    })
      .then(res => res)
      .catch(err => {
        console.log(err);
        return err;
      });
  }
}
