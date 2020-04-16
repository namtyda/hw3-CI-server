const { promisify } = require('util');
const fs = require('fs');
const { exec } = require("child_process");

exports.mkDirAsync = promisify(fs.mkdir);
exports.fileExistsAsync = promisify(fs.exists);
exports.execAsync = promisify(exec);


