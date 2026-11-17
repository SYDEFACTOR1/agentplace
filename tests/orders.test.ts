import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Orders API', () => {
  it('GET /api/v1/orders should list all pre-seeded orders', async () => {
    const res = await request(app).get('/api/v1/orders');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThanOrEqual(4);
  });

  it('GET /api/v1/orders/:orderId should return details for an existing order', async () => {
    const res = await request(app).get('/api/v1/orders/ORD-8821');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.order.orderId).toBe('ORD-8821');
    expect(res.body.order.status).toBe('in_progress');
    expect(res.body.order.assignedTechnician).toContain('Dmitri Rostov');
    expect(res.body.order.timeline.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/orders/:orderId should be case-insensitive', async () => {
    const res = await request(app).get('/api/v1/orders/ord-7749');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.order.orderId).toBe('ORD-7749');
    expect(res.body.order.status).toBe('ready_for_pickup');
  });

  it('GET /api/v1/orders/:orderId should return 404 for non-existent order', async () => {
    const res = await request(app).get('/api/v1/orders/ORD-0000-NONEXISTENT');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
