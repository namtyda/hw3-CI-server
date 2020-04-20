const MockAdapter = require('axios-mock-adapter');
const axios = require('../utils/axios-inst');
const origAxios = require('axios');
const controller = require('../controllers/controller');
const { stub } = require('sinon');
const { expect } = require('chai');

const mock = new MockAdapter(axios);

describe('Проверка методов работы с api', () => {
  it('Получение настроек из хранилища getSettings', async () => {
    const data = {
      "data": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "repoName": "namtyda",
        "buildCommand": "npm run",
        "mainBranch": "master",
        "period": 1
      }
    }
    mock.onGet('https://hw.shri.yandex/api/conf')
      .reply(200, data);
    const res = {};
    res.status = stub().returns(res);
    res.send = stub().returns(res);

    await controller.getSettings({}, res);
    expect(res.send.firstCall.args[0]).to.eql({
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      repoName: 'namtyda',
      buildCommand: 'npm run',
      mainBranch: 'master',
      period: 1
    });
    expect(res.status.firstCall.args[0]).to.equal(200);
  });

  it('Получение списка билдов getBuilds', async () => {
    const data = {
      "data": [
        {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "configurationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "buildNumber": 1,
          "commitMessage": "test",
          "commitHash": "test",
          "branchName": "master",
          "authorName": "Andrey Pogorelov",
          "status": "Waiting",
          "start": "2020-04-09T20:36:19.783Z",
          "duration": 1
        }
      ]
    }
    mock.onGet('https://hw.shri.yandex/api/build/list', {
      params: {
        offset: 0,
        limit: 25
      }
    })
      .reply(200, data);

    const res = {};
    res.status = stub().returns(res);
    res.send = stub().returns(res);
    await controller.getBuilds({
      query: {
        limit: 25,
        offset: 0
      }
    }, res);
    expect(res.status.firstCall.args[0]).to.equal(200);
    expect(res.send.firstCall.args[0]).to.eql([
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        configurationId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        buildNumber: 1,
        commitMessage: 'test',
        commitHash: 'test',
        branchName: 'master',
        authorName: 'Andrey Pogorelov',
        status: 'Waiting',
        start: '2020-04-09T20:36:19.783Z',
        duration: 1
      }
    ]);
  });

  it('Получение информации о билде, по buildId, getBuildId', async () => {
    const data = {
      "data": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "configurationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "buildNumber": 2,
        "commitMessage": "test",
        "commitHash": "test",
        "branchName": "master",
        "authorName": "Andrey Pogorelov",
        "status": "Waiting",
        "start": "2020-04-09T20:54:05.993Z",
        "duration": 2
      }
    }
    mock.onGet('https://hw.shri.yandex/api/build/details', {
      params: {
        buildId: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
      }
    }).reply(200, data);

    const res = {};
    res.status = stub().returns(res);
    res.send = stub().returns(res);

    await controller.getBuildId({
      params: {
        buildId: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
      }
    }, res);
    expect(res.status.firstCall.args[0]).to.equal(200);
    expect(res.send.firstCall.args[0]).to.eql({
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      configurationId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      buildNumber: 2,
      commitMessage: 'test',
      commitHash: 'test',
      branchName: 'master',
      authorName: 'Andrey Pogorelov',
      status: 'Waiting',
      start: '2020-04-09T20:54:05.993Z',
      duration: 2
    });
  });

});