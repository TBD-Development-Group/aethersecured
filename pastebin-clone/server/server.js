const storage = require('./storage');

app.post('/api/pastes', async (req, res) => {
  const { code, title } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Code content is required' });
  }

  const id = generateId();
  const paste = {
    id,
    code,
    title: title || 'Untitled Paste',
    createdAt: new Date().toISOString(),
    views: 0,
  };

  await storage.saveScript(id, paste);

  res.json({
    id,
    url: `${req.protocol}://${req.get('host')}/p/${id}`,
    createdAt: paste.createdAt,
  });
});

app.get('/p/:id', async (req, res) => {
  const paste = await storage.getScript(req.params.id);
  if (!paste) {
    return res.status(404).send('Paste not found');
  }

  paste.views++;
  await storage.saveScript(paste.id, paste);

  res.type('text/plain').send(paste.code);
});
