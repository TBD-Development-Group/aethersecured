const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

// Use absolute path for Render
const STORAGE_PATH = path.join(__dirname, '../storage');

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_PATH)) {
    fs.mkdirSync(STORAGE_PATH, { recursive: true });
}

async function saveScript(id, data) {
    const filePath = path.join(STORAGE_PATH, `${id}.json`);
    await writeFile(filePath, JSON.stringify(data));
    return data;
}

async function getScript(id) {
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
    getScript
};
