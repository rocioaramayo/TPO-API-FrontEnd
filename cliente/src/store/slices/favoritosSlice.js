import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Async thunks
export const fetchFavoritos = createAsyncThunk(
  'favoritos/fetchFavoritos',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/favoritos`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addFavorito = createAsyncThunk(
  'favoritos/addFavorito',
  async (productoId, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/v1/favoritos/${productoId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeFavorito = createAsyncThunk(
  'favoritos/removeFavorito',
  async (productoId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/v1/favoritos/${productoId}`);
      return productoId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const favoritosSlice = createSlice({
  name: 'favoritos',
  initialState,
  reducers: {
    clearFavoritos: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch favoritos
      .addCase(fetchFavoritos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoritos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavoritos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add favorito
      .addCase(addFavorito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavorito.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addFavorito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove favorito
      .addCase(removeFavorito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavorito.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(removeFavorito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFavoritos } = favoritosSlice.actions;
export default favoritosSlice.reducer; 