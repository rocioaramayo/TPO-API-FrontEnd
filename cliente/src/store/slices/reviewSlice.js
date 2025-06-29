import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Obtener reviews de un producto
export const fetchReviewsByProduct = createAsyncThunk(
  'reviews/fetchReviewsByProduct',
  async (productoId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/reviews/${productoId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Crear una review
export const createReview = createAsyncThunk(
  'reviews/createReview',
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/reviews`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return res.data;
    } catch (err) {
      // El backend puede devolver mensajes personalizados
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  items: [], // reviews del producto actual
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  createSuccess: false,
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearCreateReviewStatus: (state) => {
      state.createLoading = false;
      state.createError = null;
      state.createSuccess = false;
    },
    clearReviews: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener reviews
      .addCase(fetchReviewsByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.items = [];
      })
      .addCase(fetchReviewsByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchReviewsByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Crear review
      .addCase(createReview.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        state.items = [...state.items, action.payload]; // Agrega la nueva review al final de forma inmutable
      })
      .addCase(createReview.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
        state.createSuccess = false;
      });
  },
});

export const { clearCreateReviewStatus, clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer; 