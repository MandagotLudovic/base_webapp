import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('GET /api/health', () => {
  it('retourne 200 et un statut ok', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
  });

  it("n'expose pas l'en-tête X-Powered-By", async () => {
    const res = await request(app).get('/api/health');

    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('retourne des en-têtes de sécurité Helmet', async () => {
    const res = await request(app).get('/api/health');

    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
});

describe('Route inconnue', () => {
  it('retourne 404 en JSON', async () => {
    const res = await request(app).get('/api/inexistante');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Route introuvable' });
  });
});
