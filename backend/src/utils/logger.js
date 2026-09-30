import morgan from 'morgan';

// In production, you might want to use winston or pino. For MVP, morgan + console is sufficient.
export const loggerMiddleware = morgan('dev');

export const logger = {
  info: (msg, meta = {}) => console.log(`[INFO] ${msg}`, Object.keys(meta).length ? meta : ''),
  error: (msg, meta = {}) => console.error(`[ERROR] ${msg}`, Object.keys(meta).length ? meta : ''),
  warn: (msg, meta = {}) => console.warn(`[WARN] ${msg}`, Object.keys(meta).length ? meta : ''),
};
