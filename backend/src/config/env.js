import 'dotenv/config';
import { z } from 'zod';

// Schéma de validation des variables d'environnement
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),

  // Base de données
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_NAME: z.string().default('template_app'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres'),

  // JWT : secrets longs obligatoires (32 caractères minimum)
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET doit faire au moins 32 caractères'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET doit faire au moins 32 caractères'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // CORS : liste d'origines séparées par des virgules
  CORS_ORIGINS: z.string().default('http://localhost:8080'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Configuration invalide :');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  // Transforme "a,b" en ['a', 'b']
  CORS_ORIGINS: parsed.data.CORS_ORIGINS.split(',').map((o) => o.trim()),
  isProduction: parsed.data.NODE_ENV === 'production',
  isTest: parsed.data.NODE_ENV === 'test',
};
