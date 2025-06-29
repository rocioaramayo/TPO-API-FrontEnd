import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // { id, nombre, precio, fotos, stock, quantity }
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          existingItem.quantity += 1;
        }
      } else {
        state.items = [...state.items, { ...product, quantity: 1 }];
      }
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
    },
    incrementQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.items.find((item) => item.id === productId);
      if (item && item.quantity < item.stock) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.items.find((item) => item.id === productId);
      if (item) {
        item.quantity -= 1;
        if (item.quantity === 0) {
          state.items = state.items.filter((i) => i.id !== productId);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  incrementQuantity, 
  decrementQuantity, 
  clearCart 
} = cartSlice.actions;

export default cartSlice.reducer; 