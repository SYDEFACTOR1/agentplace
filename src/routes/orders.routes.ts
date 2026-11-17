import { Router } from 'express';
import { getOrderById, listRecentOrders } from '../controllers/orders.controller';

const router = Router();

// GET /api/v1/orders
router.get('/', listRecentOrders);

// GET /api/v1/orders/:orderId
router.get('/:orderId', getOrderById);

export default router;
