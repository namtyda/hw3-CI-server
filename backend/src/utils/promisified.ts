import { promisify } from 'util';
import fs from 'fs';
import { exec } from "child_process";

const fileExistsAsync = promisify(fs.exists);
const getStatAsync = promisify(fs.stat);
const mkDirAsync = promisify(fs.mkdir);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const execAsync = promisify(exec);

export { fileExistsAsync, getStatAsync, mkDirAsync, readFileAsync, writeFileAsync, execAsync }

