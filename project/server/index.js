import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { WebhookManager } from './webhookManager.js';
import { validateNotionToken } from './notionUtils.js';

config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL 
      : 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
});

// Security and utility middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(compression());
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:5173',
  credentials: true
}));

// Initialize webhook manager
const webhookManager = new WebhookManager(io);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../client');
  app.use(express.static(clientPath));
  
  // Handle client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  const webhookId = socket.handshake.auth.webhookId;
  console.log(`Client connected with webhook ID: ${webhookId}`);

  webhookManager.registerWebhook(webhookId, socket);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${webhookId}`);
    webhookManager.unregisterWebhook(webhookId);
  });
});

// API Routes
app.post('/api/webhook/:webhookId', async (req, res) => {
  const { webhookId } = req.params;
  const webhook = webhookManager.getWebhook(webhookId);

  if (!webhook) {
    return res.status(404).json({ error: 'Webhook not found' });
  }

  try {
    const result = await webhookManager.handleWebhookRequest(webhookId, req.body);
    res.json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 10000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});