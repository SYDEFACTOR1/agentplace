import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { openApiSpec } from './swagger/openapi';

import availabilityRoutes from './routes/availability.routes';
import ordersRoutes from './routes/orders.routes';
import quotesRoutes from './routes/quotes.routes';
import bookingsRoutes from './routes/bookings.routes';

const app: Application = express();

// Global Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(requestLogger);

// OpenAPI JSON & Swagger UI Documentation
app.get('/openapi.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(openApiSpec);
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Root Endpoint - Platform Health & Information for Agentplace
app.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: config.businessName,
    version: config.apiVersion,
    environment: config.nodeEnv,
    documentation: '/docs',
    openapiSpec: '/openapi.json',
    contact: config.businessContact,
    endpoints: {
      checkAvailability: 'GET /api/v1/availability?serviceType=standard_tuneup&date=2026-11-17&location=downtown',
      trackOrder: 'GET /api/v1/orders/:orderId (e.g. /api/v1/orders/ORD-8821)',
      listRecentOrders: 'GET /api/v1/orders',
      calculateQuote: 'POST /api/v1/quotes',
      createBooking: 'POST /api/v1/bookings'
    },
    demoOrders: ['ORD-8821', 'ORD-7749', 'ORD-9912', 'ORD-3304']
  });
});

// API Routes
app.use('/api/v1/availability', availabilityRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/quotes', quotesRoutes);
app.use('/api/v1/bookings', bookingsRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
