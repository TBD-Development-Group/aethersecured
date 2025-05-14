require('dotenv').config();
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const storage = require('./storage');  // Now correctly points to storage.js

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Generate random ID
function generateId() {
    return crypto.randomBytes(8).toString('hex');
}

// API Endpoints
app.post('/api/pastes', async (req, res) => {
    try {
        const { code, title } = req.body;
        
        if (!code) {
            return res.status(400).json({ error: 'Code content is required' });
        }

        const id = generateId();
        const paste = {
            id,
            code,
            title: title || 'Untitled Paste',
            createdAt: new Date(),
            views: 0
        };

        await storage.saveScript(id, paste);

        res.json({
            id,
            url: `${req.protocol}://${req.get('host')}/p/${id}`,
            createdAt: paste.createdAt
        });
    } catch (error) {
        console.error('Error creating paste:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/p/:id', async (req, res) => {
    try {
        const paste = await storage.getScript(req.params.id);
        if (!paste) {
            return res.status(404).send('Paste not found');
        }

        // Update view count
        paste.views++;
        await storage.saveScript(paste.id, paste);

        // Return raw code
        res.set('Content-Type', 'text/plain');
        res.send(paste.code);
    } catch (error) {
        console.error('Error fetching paste:', error);
        res.status(500).send('Internal server error');
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
