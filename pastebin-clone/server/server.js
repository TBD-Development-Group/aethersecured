const express = require('express');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Simple database (in production use a real database)
const pastes = {};
const PASTE_DIR = path.join(__dirname, 'pastes');

// Ensure paste directory exists
if (!fs.existsSync(PASTE_DIR)) {
    fs.mkdirSync(PASTE_DIR);
}

// Generate a unique hash
function generateHash() {
    return crypto.randomBytes(8).toString('hex');
}

// API endpoint to create pastes
app.post('/api/paste', (req, res) => {
    const { code } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'No code provided' });
    }

    const hash = generateHash();
    const filePath = path.join(PASTE_DIR, `${hash}.lua`);

    // Save to file system
    fs.writeFileSync(filePath, code);

    // Store in memory (in production use a database)
    pastes[hash] = {
        createdAt: new Date(),
        views: 0
    };

    res.json({ hash });
});

// Endpoint to get paste by hash
app.get('/p/:hash', (req, res) => {
    const { hash } = req.params;
    
    if (!pastes[hash]) {
        return res.status(404).send('Paste not found or expired');
    }

    const filePath = path.join(PASTE_DIR, `${hash}.lua`);
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Paste not found');
    }

    // Increment view count
    pastes[hash].views += 1;

    // Set content type to plain text
    res.set('Content-Type', 'text/plain');
    
    // Send the raw code
    res.send(fs.readFileSync(filePath, 'utf-8'));
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
