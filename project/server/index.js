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

// Load environment variables
config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? false 
      : 'http://localhost:5173',
    methods: ['GET', 'POST'],
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

// CORS for development
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
}

// Initialize webhook manager
const webhookManager = new WebhookManager(io);

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

app.post('/api/validate-token', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const isValid = await validateNotionToken(token);
    res.json({ valid: isValid });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  
  // Handle client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});