import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { initDatabase } from './database';

import authRoutes from './routes/auth';
import campaignRoutes from './routes/campaigns';
import donationRoutes from './routes/donations';
import userRoutes from './routes/users';
import volunteerRoutes from './routes/volunteers';
import ongRoutes from './routes/ongs';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  const originalSend = res.send;
  res.send = function (body) {
    if (res.statusCode >= 400) {
      console.error(`[${new Date().toISOString()}] ${req.method} ${req.url} - Status ${res.statusCode} - Error:`, body);
    }
    return originalSend.call(this, body);
  };
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/ongs', ongRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
async function start() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`\nAll Ong's Backend running on http://localhost:${PORT}`);
      console.log(`API Base: http://localhost:${PORT}/api`);
      console.log(`Health: http://localhost:${PORT}/api/health\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
