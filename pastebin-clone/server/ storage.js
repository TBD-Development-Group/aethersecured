// server/storage.js
const fs = require('fs').promises;
const path = require('path');

const STORAGE_PATH = path.resolve(__dirname, '../storage');

// Ensure storage directory exists on load
async function ensureStorageDir() {
  try {
    await fs.mkdir(STORAGE_PATH, { recursive: true });
  } catch (err) {
    // Handle error if needed
    console.error('Failed to create storage directory:', err);
  }
}
ensureStorageDir();

async function saveScript(id, data) {
  const filePath = path.join(STORAGE_PATH, `${id}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  return data;
}

async function getScript(id) {
  const filePath = path.join(STORAGE_PATH, `${id}.json`);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null; // Not found
    }
    throw err; // Unexpected error
  }
}

async function deleteScript(id) {
  const filePath = path.join(STORAGE_PATH, `${id}.json`);
  try {
    await fs.unlink(filePath);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false; // File didn't exist
    }
    throw err;
  }
}

module.exports = {
  saveScript,
  getScript,
  deleteScript,
};
