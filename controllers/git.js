const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

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
  // Проверяю наличие папки
  fs.stat(path.join(__dirname, '../', 'normalize.css'), (err, stat) => {
    if (err) {
      return console.log('Ошибка про проверки папки', err);
    }
    
    let buff = Buffer.alloc(0);
    let result;
    process.chdir(path.join(__dirname, '../', 'normalize.css'));

    const git = spawn('git', ['log', '-2', '--pretty=format:%H %cn %s']);
    console.log(path.join(__dirname, '../normalize.css'))

    git.stderr.on('data', err => {
      console.log(err.toString('UTF-8'));
    });

    git.stdout.on('data', data => {
      buff = Buffer.concat([buff, data])
    });

    git.on('close', code => {
      console.log(`Это код завершения процесса получения логов ${code}`);
      const res = buff.toString().split('\n');
      result = res.map((el, i) => el.split(' '));
      console.log(result);
    });
  });
}
getCommitInfo();
module.exports = { gitClone, getCommitInfo }


// const log = fs.createWriteStream('../log/log.txt', {flags: 'a'});
// const err = fs.createWriteStream('../log/logErr.txt', {flags: 'a'});
// const ss = spawan(...).stdio: [process.stdin, log, err]

// ss.stdout.pipe(logStream)

//git log -2 --pretty=format:'%H % cn %s'