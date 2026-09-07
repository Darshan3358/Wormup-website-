import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { registerOrderSockets } from './sockets/orderSocket.js';
import { checkScheduledCampaigns, startEmailWorker } from './jobs/emailWorker.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.use(cors());
app.use(express.json());

// Scaffolding API Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Womup Quick-Commerce Vegetable Delivery API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Register Socket.IO handlers
registerOrderSockets(io);

// Optional: run email cron every minute if REDIS_URL is configured
if (process.env.ENABLE_WORKER === 'true') {
  try {
    startEmailWorker();
    setInterval(checkScheduledCampaigns, 60000);
    console.log('[Womup API] Scheduled Email Worker & Cron initialized');
  } catch (err) {
    console.warn('[Womup API] Redis not connected. Worker running in simulated mode.');
  }
}

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🥦 Womup Quick-Commerce Server running on http://localhost:${PORT}`);
  });
}

export default app;
