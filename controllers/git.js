const { spawn } = require('child_process');
const path = require('path');
function gitClone() {
  const git = spawn("git", ["clone", "https://github.com/necolas/normalize.css.git"]);
  git.stderr.on('data', err => {
    console.log(err.toString('UTF-8'));
  });

  git.on('close', code => {
    console.log(`Это код завершения процесса клона репы, спавна ${code}`)
  })
}



function getCommitInfo() {
  let buff = Buffer.alloc(0);
  const git = spawn('git', ['log', '--pretty=format:%H %cn %s'], {cdw: path.join(__dirname, '../normalize.css')});
  console.log(path.join(__dirname, '../normalize.css'))

  git.stderr.on('data', err => {
    console.log(err.toString('UTF-8'));
  });

  git.stdout.on('data', data => {
    buff = Buffer.concat([buff, data])
  });

  git.on('close', code => {
    console.log(`Это код завершения процесса получения логов ${code}`);
    const result = buff.toString().split('\n');
    console.log(result)
  });
}
getCommitInfo();
module.exports = { gitClone, getCommitInfo }
