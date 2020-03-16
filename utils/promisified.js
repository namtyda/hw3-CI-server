const { promisify } = require('util');
const fs = require('fs');

exports.fileExistsAsync = promisify(fs.exists);
exports.getStatAsync = promisify(fs.stat);
exports.mkDirAsync = promisify(fs.mkdir);
exports.readFileAsync = promisify(fs.readFile);
exports.writeFileAsync = promisify(fs.writeFile);
