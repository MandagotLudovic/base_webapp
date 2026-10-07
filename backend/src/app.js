import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';

const app = express();

// Derrière un reverse proxy (nginx, load balancer), nécessaire pour le rate limit par IP
app.set('trust proxy', 1);

// Retire l'en-tête "X-Powered-By: Express"
app.disable('x-powered-by');

// --- Sécurité ---
app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      // Autorise les outils sans origin (curl, Postman, tests) et les origines whitelistées
      if (!origin || env.CORS_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origine non autorisée par CORS'));
    },
    credentials: true,
  })
);

// Limitation globale du débit : 100 requêtes / 15 min / IP
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: () => env.isTest, // Désactivé pendant les tests
  })
);

// --- Parsing ---
app.use(express.json({ limit: '10kb' })); // Limite la taille du body
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(cookieParser());

// --- Logs HTTP (désactivés en test) ---
if (!env.isTest) {
  app.use(morgan(env.isProduction ? 'combined' : 'dev'));
}

// --- Routes ---
// Route de santé : utilisée par Docker et les tests
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- 404 ---
app.use((_req, res) => {
  res.status(404).json({ error: 'Route introuvable' });
});

// --- Gestionnaire d'erreurs global (4 arguments obligatoires pour Express) ---
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: env.isProduction && status === 500 ? 'Erreur interne du serveur' : err.message,
  });
});

export default app;
