import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('POST /api/v1/quotes', () => {
  it('should calculate accurate standard quote with itemized services', async () => {
    const res = await request(app)
      .post('/api/v1/quotes')
      .send({
        customerName: 'Marcus Aurelius',
        bikeModel: 'Trek FX 3 Disc',
        isElectric: false,
        serviceTypes: ['standard_tuneup'],
        urgency: 'standard'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.quote.quoteId).toMatch(/^QTE-\d+/);
    expect(res.body.quote.pricing.subtotal).toBe('$89.00');
    expect(res.body.quote.pricing.ebikeSafetySurcharge).toBe('$0.00');
  });

  it('should apply e-bike surcharge and promo code correctly', async () => {
    const res = await request(app)
      .post('/api/v1/quotes')
      .send({
        customerName: 'Ada Lovelace',
        bikeModel: 'Specialized Turbo Vado',
        isElectric: true,
        serviceTypes: ['ebike_diagnostic'],
        urgency: 'standard',
        promoCode: 'WELCOME10'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.quote.pricing.ebikeSafetySurcharge).toBe('$25.00');
    expect(res.body.quote.pricing.discountCode).toBe('WELCOME10');
    expect(res.body.quote.pricing.discountApplied).toBe('-$11.90'); // 10% of $119
  });

  it('should apply express urgency fee', async () => {
    const res = await request(app)
      .post('/api/v1/quotes')
      .send({
        customerName: 'Flash Gordon',
        bikeModel: 'Pinarello Dogma F',
        isElectric: false,
        serviceTypes: ['brake_overhaul'],
        urgency: 'emergency_same_day'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.quote.pricing.urgencyFee).toBe('$47.50'); // 50% of 95.00
    expect(res.body.quote.turnaround.estimatedHours).toBe(3);
  });

  it('should reject invalid payload without serviceTypes', async () => {
    const res = await request(app)
      .post('/api/v1/quotes')
      .send({
        customerName: 'Test'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
