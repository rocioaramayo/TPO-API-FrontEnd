import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import categoriesReducer from './slices/categoriesSlice';
import usersReducer from './slices/usersSlice';
import ordersReducer from './slices/ordersSlice';
import favoritosReducer from './slices/favoritosSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    users: usersReducer,
    orders: ordersReducer,
    favoritos: favoritosReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
}); 