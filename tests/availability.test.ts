import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('GET /api/v1/availability', () => {
  it('should return 200 and available slots for valid query', async () => {
    const res = await request(app)
      .get('/api/v1/availability')
      .query({ location: 'downtown', date: '2026-11-17' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.slots)).toBe(true);
    expect(res.body.catalogServices.length).toBeGreaterThan(0);
  });

  it('should filter by serviceType properly', async () => {
    const res = await request(app)
      .get('/api/v1/availability')
      .query({ serviceType: 'ebike_diagnostic', location: 'westside' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.meta.serviceType).toBe('ebike_diagnostic');
  });

  it('should reject invalid serviceType', async () => {
    const res = await request(app)
      .get('/api/v1/availability')
      .query({ serviceType: 'invalid_type_xyz' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
