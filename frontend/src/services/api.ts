import axios from "axios";

// Create axios instance for Node.js backend (orders)
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create axios instance for .NET backend (categories/products)
const dotnetApi = axios.create({
  baseURL: "http://localhost:5039/api", // Direct access to .NET API
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error(
      "API Response Error:",
      error.response?.status,
      error.response?.data,
    );
    return Promise.reject(error);
  },
);

// .NET API endpoints for categories and products
export const categoryAPI = {
  // Get all categories (which include products)
  getCategories: async () => {
    const response = await dotnetApi.get("/categories");
    return response.data;
  },

  // Get products by category (if needed)
  // getProductsByCategory: async (categoryId: string) => {
  //   const response = await dotnetApi.get(`/categories/${categoryId}/products`);
  //   return response.data;
  // },

  // Get all products by flattening categories data
  getAllProducts: async () => {
    const response = await dotnetApi.get("/categories");
    const categories = response.data;

    // Flatten products from all categories
    const allProducts = categories.flatMap((category: any) =>
      category.products.map((product: any) => ({
        ...product,
        id: String(product.id), // Ensure ID is a string
        category: category.name, // Add category name to each product
        categoryId: category.id,
      })),
    );

    return allProducts;
  },
};

// Node.js API endpoints for orders
export const orderAPI = {
  // Submit a new order
  submitOrder: async (orderData: {
    userDetails: {
      firstName: string;
      lastName: string;
      email: string;
    };
    selectedProducts: Array<{
      id: string;
      name: string;
      category: string;
      price: number;
      description?: string;
      quantity: number;
    }>;
  }) => {
    // Transform data to ensure compatibility with backend validation
    const transformedOrderData = {
      userDetails: {
        firstName: String(orderData.userDetails.firstName),
        lastName: String(orderData.userDetails.lastName),
        email: String(orderData.userDetails.email),
      },
      selectedProducts: orderData.selectedProducts.map((product) => ({
        id: String(product.id),
        name: String(product.name),
        category: String(product.category),
        price: Number(product.price),
        description: product.description
          ? String(product.description)
          : undefined,
        quantity: Number(product.quantity),
      })),
    };

    console.log(
      "🔍 Submitting order with data:",
      JSON.stringify(transformedOrderData, null, 2),
    );

    try {
      const response = await api.post("/orders", transformedOrderData);
      console.log("✅ Order submission successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Order submission failed:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      // Log detailed validation errors
      if (error.response?.data?.errors) {
        console.error("🔍 Validation errors:", error.response.data.errors);
        error.response.data.errors.forEach((err: any, index: number) => {
          console.error(
            `  ${index + 1}. ${err.path?.join(".")}: ${err.message}`,
          );
        });
      }

      throw error;
    }
  },

  // Get all orders (for admin purposes)
  getAllOrders: async () => {
    const response = await api.get("/orders");
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId: string) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },
};

export default api;
