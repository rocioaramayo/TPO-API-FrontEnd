import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import categoriesReducer from './slices/categoriesSlice';
import usersReducer from './slices/usersSlice';
import ordersReducer from './slices/ordersSlice';
import favoritosReducer from './slices/favoritosSlice';
import cartReducer from './slices/cartSlice';
import metodoEntregaReducer from './slices/metodoEntregaSlice';
import puntoEntregaReducer from './slices/puntoEntregaSlice';
import descuentosReducer from './slices/descuentosSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    users: usersReducer,
    orders: ordersReducer,
    favoritos: favoritosReducer,
    cart: cartReducer,
    metodoEntrega: metodoEntregaReducer,
    puntoEntrega: puntoEntregaReducer,
    descuentos: descuentosReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
}); 