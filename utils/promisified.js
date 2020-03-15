const { promisify } = require('util');
const fs = require('fs');

exports.fileExistsAsync = promisify(fs.exists);