import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const fetchPuntoEntrega = createAsyncThunk('puntoEntrega/fetchPuntoEntrega', async (token, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/entregas/puntos`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const puntoEntregaSlice = createSlice({
  name: 'puntoEntrega',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPuntoEntrega.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPuntoEntrega.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchPuntoEntrega.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default puntoEntregaSlice.reducer; 
