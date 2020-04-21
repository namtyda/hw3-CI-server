import express from 'express';
export const router = express.Router();

import { getSettings, getBuilds, getBuildId, getLogs, postAddInstQueue, postSettings } from '../controllers/controller';

export interface getConfig {
  id: string;
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
  data: getBuilds<Status>[];
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
export interface getBuildsParams {
  limit?: number;
  offset?: number;
}
interface buildIdQuery {
  buildId: string;
}
interface addQueueQuery {
  commitHash: string;
}

export interface addQueueBody {
  commitMessage: string;
  commitHash: string;
  branchName: string;
  authorName: string;
}

export interface saveSettings {
  repoName: string;
  buildCommand: string;
  mainBranch: string;
  period: number;
}
router.get<{}, getConfig | string>('/settings', getSettings);
router.get<{}, Array<getBuilds<Status>> | string, getBuildsParams>('/builds', getBuilds);
router.get<{}, Array<getBuilds<Status>> | string, buildIdQuery>('/builds/:buildId', getBuildId);
router.get<{}, string, buildIdQuery>('/builds/:buildId/logs', getLogs);

router.post<{}, addQueueBody | string,  addQueueQuery>('/builds/:commitHash', postAddInstQueue);
router.post<{}, saveSettings | string, saveSettings>('/settings', postSettings);


