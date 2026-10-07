import app from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, () => {
  console.info(`🚀 API démarrée sur http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

// Arrêt propre (important pour Docker : SIGTERM)
const shutdown = (signal) => {
  console.info(`${signal} reçu, arrêt du serveur...`);
  server.close(() => process.exit(0));
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
