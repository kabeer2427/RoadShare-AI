import app from './app.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';

const startServer = () => {
  try {
    app.listen(config.port, () => {
      logger.info(`🚀 AI Mobility Platform backend running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
