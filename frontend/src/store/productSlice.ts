import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { categoryAPI } from "../services/api";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  categoryId?: number;
  isCustom?: boolean;
}

export interface SelectedProduct extends Product {
  quantity: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  products?: Product[];
}

interface ProductState {
  availableProducts: Product[];
  selectedProducts: SelectedProduct[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  availableProducts: [],
  selectedProducts: [],
  categories: [],
  isLoading: false,
  error: null,
};

// Async thunk to fetch categories (which include products)
export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async () => {
    try {
      const response = await categoryAPI.getCategories();
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch categories",
      );
    }
  },
);

// Async thunk to fetch all products (flattened from categories)
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async () => {
    try {
      const response = await categoryAPI.getAllProducts();
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

// Async thunk to fetch products by category
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (categoryId: string) => {
    try {
      const response = await categoryAPI.getProductsByCategory(categoryId);
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch products by category",
      );
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      const existingProduct = state.selectedProducts.find(
        (product) => product.id === action.payload.id,
      );
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.selectedProducts.push({ ...action.payload, quantity: 1 });
      }
    },
    addCustomProduct: (state, action: PayloadAction<SelectedProduct>) => {
      const existingProduct = state.selectedProducts.find(
        (product) => product.id === action.payload.id,
      );
      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity;
      } else {
        state.selectedProducts.push(action.payload);
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.selectedProducts = state.selectedProducts.filter(
        (product) => product.id !== action.payload,
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const product = state.selectedProducts.find(
        (product) => product.id === action.payload.id,
      );
      if (product) {
        if (action.payload.quantity <= 0) {
          state.selectedProducts = state.selectedProducts.filter(
            (p) => p.id !== action.payload.id,
          );
        } else {
          product.quantity = action.payload.quantity;
        }
      }
    },
    clearSelectedProducts: (state) => {
      state.selectedProducts = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchCategories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;

        // Also populate products from categories
        const allProducts = action.payload.flatMap((category: Category) =>
          (category.products || []).map((product: any) => ({
            ...product,
            id: String(product.id),
            category: category.name,
            categoryId: category.id,
          })),
        );
        state.availableProducts = allProducts;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch categories";
      });

    // Handle fetchAllProducts
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableProducts = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch products";
      });

    // Handle fetchProductsByCategory
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        // Merge new products with existing ones, avoiding duplicates
        const newProducts = action.payload;
        const existingIds = state.availableProducts.map((p) => p.id);
        const uniqueNewProducts = newProducts.filter(
          (p) => !existingIds.includes(p.id),
        );
        state.availableProducts = [
          ...state.availableProducts,
          ...uniqueNewProducts,
        ];
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "Failed to fetch products by category";
      });
  },
});

export const {
  addProduct,
  addCustomProduct,
  removeProduct,
  updateQuantity,
  clearSelectedProducts,
  clearError,
} = productSlice.actions;
export default productSlice.reducer;
