const express = require('express');
const path = require('path');
const crypto = require('crypto');
const { saveScript, getScript } = require('./storage');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API endpoint to create scripts
app.post('/api/scripts', async (req, res) => {
    try {
        const { code, name } = req.body;
        
        if (!code) {
            return res.status(400).json({ error: 'Script content is required' });
        }

        // Generate unique ID
        const id = crypto.randomBytes(8).toString('hex');
        const createdAt = new Date();

        // Save to storage
        await saveScript(id, {
            code,
            name: name || 'Unnamed Script',
            createdAt,
            views: 0
        });

        res.json({ 
            id,
            url: `${req.protocol}://${req.get('host')}/s/${id}`,
            createdAt
        });
    } catch (error) {
        console.error('Error creating script:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to get script by ID
app.get('/s/:id', async (req, res) => {
    try {
        const script = await getScript(req.params.id);
        if (!script) {
            return res.status(404).send('Script not found');
        }

        // Update view count
        script.views++;
        await saveScript(req.params.id, script);

        // Return raw Lua code
        res.set('Content-Type', 'text/plain');
        res.send(script.code);
    } catch (error) {
        console.error('Error fetching script:', error);
        res.status(500).send('Internal server error');
    }
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
