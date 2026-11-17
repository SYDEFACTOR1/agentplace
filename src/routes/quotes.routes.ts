import { Router } from 'express';
import { calculateQuote } from '../controllers/quotes.controller';

const router = Router();

// POST /api/v1/quotes
router.post('/', calculateQuote);

export default router;
