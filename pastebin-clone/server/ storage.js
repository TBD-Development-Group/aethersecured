const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);

const STORAGE_PATH = path.join(__dirname, '../storage');

async function ensureStorageDir() {
  try {
    await access(STORAGE_PATH, fs.constants.F_OK);
    // Directory exists
  } catch {
    // Directory does not exist, create it
    await mkdir(STORAGE_PATH, { recursive: true });
  }
}

async function saveScript(id, data) {
  await ensureStorageDir();
  const filePath = path.join(STORAGE_PATH, `${id}.json`);
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  return data;
}

async function getScript(id) {
  await ensureStorageDir();
  const filePath = path.join(STORAGE_PATH, `${id}.json`);
  try {
    const data = await readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

module.exports = {
  saveScript,
  getScript,
};
