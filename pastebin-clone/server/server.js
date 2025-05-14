const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, '../public')));

// API endpoint to create pastes
app.get('/api/paste', (req, res) => {
    const code = req.query.code;
    
    if (!code) {
        return res.status(400).send('No code provided');
    }

    // Set content type to plain text
    res.set('Content-Type', 'text/plain');
    
    // Send back the raw code
    res.send(decodeURIComponent(code));
});

// Handle direct code URLs
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
