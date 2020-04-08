const { EventEmitter } = require('events');
const { Writable } = require('stream');
const child = require('child_process');
const { stub } = require('sinon');
const { expect } = require('chai');
const { join } = require('path');

const { cloneRepo, pull, commitInfo } = require('../controllers/git');

describe('Проверка передачи аргументов в spawn', () => {

  let spawn;
  let event;

  beforeEach(() => {
    spawn = stub(child, 'spawn');
    event = new EventEmitter();
    event.stdin = new Writable();
    event.stdout = new EventEmitter();
    event.stderr = new EventEmitter();
    event.kill = stub();
    spawn.returns(event);
  });

  afterEach(() => {
    spawn.restore();
    event = null;
  });

  it('gitClone аргументы в spawn передаются коррентно', () => {
    const userName = 'namtyda';
    const repoName = 'reference';
    const branchName = 'master';

    setTimeout(() => event.emit('close'), 0);


    return cloneRepo(userName, repoName, branchName)
      .then(() => {
        const [command, args, options] = (spawn.args[0]);
        expect(command).to.equal('git');
        expect(args).to.eql(["clone", '-b', branchName, `https://github.com/${userName}/${repoName}.git`]);
        expect(options).to.eql({ cwd: join(__dirname, '../', 'clonesRepo') });
      })
  });

  it('gitPull аргументы в spawn передаются коррентно', () => {
    const userName = 'namtyda';
    const repoName = 'reference';
    const branchName = 'master';

    setTimeout(() => event.emit('close'), 0);


    return pull(userName, repoName, branchName)
      .then(() => {
        const [command, args, options] = (spawn.args[0]);
        expect(command).to.equal('git');
        expect(args).to.eql(["pull", `https://github.com/${userName}/${repoName}.git`, branchName]);
        expect(options).to.eql({ cwd: join(__dirname, '../', 'clonesRepo', repoName) });
      });
  });

  it('commitInfo аргументы в spawn передаются коррентно', () => {
    const repoName = 'reference';

    setTimeout(() => event.emit('close'), 0);

    return commitInfo(repoName)
      .then(() => {
        const [command, args, options] = (spawn.args[0]);
        expect(command).to.equal('git');
        expect(args).to.eql(['log', '--pretty=format:{"commitHash":"%H", "authorName":"%cn", "commitMessage":"%s"}', "--no-decorate"]);
        expect(options).to.eql({ cwd: join(__dirname, '../', 'clonesRepo', repoName) });
      });
  });

});

