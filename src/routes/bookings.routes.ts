import { Router } from 'express';
import { createBooking } from '../controllers/bookings.controller';

const router = Router();

// POST /api/v1/bookings
router.post('/', createBooking);

export default router;
