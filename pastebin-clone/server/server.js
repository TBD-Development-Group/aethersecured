const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// In-memory database (replace with real DB in production)
let pastes = [];

// API Routes
app.post('/api/pastes', (req, res) => {
    const { title, content, syntax, expiresIn } = req.body;
    
    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }

    const newPaste = {
        id: uuidv4(),
        title: title || 'Untitled Paste',
        content,
        syntax: syntax || 'none',
        createdAt: new Date().toISOString(),
        expiresIn: expiresIn || 7,
        views: 0
    };

    pastes.unshift(newPaste);
    
    // In a real app, save to database here
    savePastes();

    res.status(201).json(newPaste);
});

app.get('/api/pastes', (req, res) => {
    res.json(pastes.slice(0, 10)); // Return only 10 most recent
});

app.get('/api/pastes/:id', (req, res) => {
    const paste = pastes.find(p => p.id === req.params.id);
    
    if (!paste) {
        return res.status(404).json({ error: 'Paste not found' });
    }

    // Increment views
    paste.views += 1;
    savePastes();

    res.json(paste);
});

app.delete('/api/pastes/:id', (req, res) => {
    const index = pastes.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Paste not found' });
    }

    pastes.splice(index, 1);
    savePastes();

    res.json({ success: true });
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Helper function to save pastes (simulating database)
function savePastes() {
    // In a real app, this would save to a database
    // For this demo, we're just keeping it in memory
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
