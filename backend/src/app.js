import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { loggerMiddleware } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { config } from './config/env.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: '*' })); // For MVP hackathon, allow all origins. Configure in prod!

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(loggerMiddleware);

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is healthy', timestamp: new Date() });
});

// Setup Routes
import authRoutes from './routes/authRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import matchingRoutes from './routes/matchingRoutes.js';
import heatmapRoutes from './routes/heatmapRoutes.js';
import agentRoutes from './routes/agentRoutes.js';

// Health check routes
app.get('/', (req, res) => res.json({ success: true, message: 'Roadshare AI API is running' }));
app.get('/api', (req, res) => res.json({ success: true, message: 'Roadshare AI API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/heatmap', heatmapRoutes);
app.use('/api/agent', agentRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'API route not found' }
  });
});

// Centralized Error Handling
app.use(errorHandler);

export default app;
