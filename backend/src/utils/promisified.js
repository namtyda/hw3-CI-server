const { promisify } = require('util');
const fs = require('fs');
const { exec } = require("child_process");

exports.fileExistsAsync = promisify(fs.exists);
exports.getStatAsync = promisify(fs.stat);
exports.mkDirAsync = promisify(fs.mkdir);
exports.readFileAsync = promisify(fs.readFile);
exports.writeFileAsync = promisify(fs.writeFile);
exports.execAsync = promisify(exec);
