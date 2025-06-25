import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { orderAPI } from "../services/api";

export interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
}

interface OrderState {
  userDetails: UserDetails;
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;
}

const initialState: OrderState = {
  userDetails: {
    firstName: "",
    lastName: "",
    email: "",
  },
  isSubmitting: false,
  submitSuccess: false,
  submitError: null,
};

// Real API call for order submission
export const submitOrder = createAsyncThunk(
  "order/submitOrder",
  async (orderData: { userDetails: UserDetails; selectedProducts: any[] }) => {
    try {
      const response = await orderAPI.submitOrder(orderData);

      if (response.success) {
        return {
          success: true,
          orderId: response.data.orderId,
          totalAmount: response.data.totalAmount,
          orderDate: response.data.orderDate,
        };
      } else {
        throw new Error(response.message || "Failed to submit order");
      }
    } catch (error: any) {
      // Handle axios errors
      if (error.response) {
        // Server responded with error status
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.errors?.[0]?.message ||
          "Server error occurred";
        throw new Error(errorMessage);
      } else if (error.request) {
        // Network error (no response received)
        throw new Error(
          "Network error. Please check your connection and try again.",
        );
      } else {
        // Other error
        throw new Error(error.message || "An unexpected error occurred");
      }
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    updateUserDetails: (state, action: PayloadAction<Partial<UserDetails>>) => {
      state.userDetails = { ...state.userDetails, ...action.payload };
    },
    resetOrder: (state) => {
      state.userDetails = initialState.userDetails;
      state.isSubmitting = false;
      state.submitSuccess = false;
      state.submitError = null;
    },
    clearSubmitStatus: (state) => {
      state.submitSuccess = false;
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
      })
      .addCase(submitOrder.fulfilled, (state) => {
        state.isSubmitting = false;
        state.submitSuccess = true;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.error.message || "An error occurred";
      });
  },
});

export const { updateUserDetails, resetOrder, clearSubmitStatus } =
  orderSlice.actions;
export default orderSlice.reducer;
