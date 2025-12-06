const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const dropdownRoutes = require('./routes/dropdownRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

dotenv.config();

function createApp() {
  const app = express();
  app.use(
    cors({
      origin: ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
    })
  );
  app.use(express.json({ limit: '5mb' }));
  app.use('/api/uploads', express.static('uploads'));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/dropdowns', dropdownRoutes);
  app.use('/api/candidates', candidateRoutes);
  app.use('/api/uploads', uploadRoutes);

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}

module.exports = { createApp };
