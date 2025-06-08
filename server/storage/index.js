const fs = require('fs').promises;
const path = require('path');

// Data folder inside storage to hold the actual json files
const DATA_PATH = path.join(__dirname, 'data');

// Ensure the data directory exists
async function ensureDataPath() {
  try {
    await fs.mkdir(DATA_PATH, { recursive: true });
  } catch (err) {
    // Ignore if already exists
  }
}

async function saveScript(id, data) {
  await ensureDataPath();
  const filePath = path.join(DATA_PATH, `${id}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  return data;
}

async function getScript(id) {
  await ensureDataPath();
  const filePath = path.join(DATA_PATH, `${id}.json`);
  try {
    const data = await fs.readFile(filePath, 'utf8');
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
