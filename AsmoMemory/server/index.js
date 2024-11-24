import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { WebhookManager } from './webhookManager.js';
import { validateNotionToken } from './notionUtils.js';

// Load environment variables
config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

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

// Webhook endpoint
app.post('/hook/:webhookId', async (req, res) => {
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

// Notion token validation endpoint
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});