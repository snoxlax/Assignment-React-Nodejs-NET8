import mongoose, { Document, Schema } from 'mongoose';

// Interface for the product structure
export interface IProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  quantity: number;
}

// Interface for user details
export interface IUserDetails {
  firstName: string;
  lastName: string;
  email: string;
}

// Interface for the complete order
export interface IOrder extends Document {
  userDetails: IUserDetails;
  selectedProducts: IProduct[];
  totalAmount: number;
  orderDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
}

// Product schema
const ProductSchema = new Schema<IProduct>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String },
  quantity: { type: Number, required: true, min: 1, default: 1 },
});

// User details schema
const UserDetailsSchema = new Schema<IUserDetails>({
  firstName: { type: String, required: true, trim: true, minlength: 2 },
  lastName: { type: String, required: true, trim: true, minlength: 2 },
  email: { type: String, required: true, trim: true, lowercase: true },
});

// Main order schema
const OrderSchema = new Schema<IOrder>(
  {
    userDetails: { type: UserDetailsSchema, required: true },
    selectedProducts: { type: [ProductSchema], required: true, minlength: 1 },
    totalAmount: { type: Number, required: true, min: 0 },
    orderDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Pre-save middleware to calculate total amount
OrderSchema.pre('save', function (next) {
  if (this.selectedProducts && this.selectedProducts.length > 0) {
    this.totalAmount = this.selectedProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  }
  next();
});

// Create and export the model
export const Order = mongoose.model<IOrder>('Order', OrderSchema);
