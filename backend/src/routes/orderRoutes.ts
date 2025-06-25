import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
} from '../controllers/orderController';

const router = Router();

// POST /api/orders - Create a new order
router.post('/', createOrder);

// GET /api/orders - Get all orders (for admin purposes)
router.get('/', getAllOrders);

// GET /api/orders/:id - Get order by ID
router.get('/:id', getOrderById);

export default router;
