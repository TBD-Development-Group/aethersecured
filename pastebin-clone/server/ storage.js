const fs = require('fs');
const path = require('path');

const SCRIPTS_DIR = path.join(__dirname, 'scripts');

// Ensure scripts directory exists
if (!fs.existsSync(SCRIPTS_DIR)) {
    fs.mkdirSync(SCRIPTS_DIR, { recursive: true });
}

async function saveScript(id, data) {
    const filePath = path.join(SCRIPTS_DIR, `${id}.json`);
    await fs.promises.writeFile(filePath, JSON.stringify(data));
    return data;
}

async function getScript(id) {
    const filePath = path.join(SCRIPTS_DIR, `${id}.json`);
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') return null;
        throw error;
    }
}

module.exports = { saveScript, getScript };
