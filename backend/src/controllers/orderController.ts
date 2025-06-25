import { Request, Response } from 'express';
import { z } from 'zod';
import { Order, IProduct, IUserDetails } from '../models/Order';

// Validation schema for order submission
const OrderSubmissionSchema = z.object({
  userDetails: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
  }),
  selectedProducts: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        category: z.string(),
        price: z.number().min(0, 'Price must be non-negative'),
        description: z.string().optional(),
        quantity: z.number().min(1, 'Quantity must be at least 1'),
      })
    )
    .min(1, 'At least one product must be selected'),
});

type OrderSubmissionData = z.infer<typeof OrderSubmissionSchema>;

/**
 * Create a new order
 * POST /api/orders
 */
export const createOrder = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = OrderSubmissionSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data',
        errors: validationResult.error.errors,
      });
    }

    const { userDetails, selectedProducts }: OrderSubmissionData =
      validationResult.data;

    // Calculate total amount
    const totalAmount = selectedProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );

    // Create new order
    const newOrder = new Order({
      userDetails,
      selectedProducts,
      totalAmount,
      orderDate: new Date(),
      status: 'pending',
    });

    // Save order to database
    const savedOrder = await newOrder.save();

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Order saved successfully',
      data: {
        orderId: savedOrder._id,
        totalAmount: savedOrder.totalAmount,
        orderDate: savedOrder.orderDate,
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);

    // Handle MongoDB-specific errors
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.message,
        });
      }

      if (error.name === 'MongoError' || error.name === 'MongoServerError') {
        return res.status(500).json({
          success: false,
          message: 'Database error occurred',
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Get all orders (for admin purposes)
 * GET /api/orders
 */
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).select('-__v');

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Get order by ID
 * GET /api/orders/:id
 */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).select('-__v');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
