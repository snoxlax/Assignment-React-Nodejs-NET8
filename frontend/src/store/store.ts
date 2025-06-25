import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./productSlice";
import orderSlice from "./orderSlice";

export const store = configureStore({
  reducer: {
    products: productSlice,
    order: orderSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
