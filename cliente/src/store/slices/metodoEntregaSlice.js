import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const fetchMetodoEntrega = createAsyncThunk('metodoEntrega/fetchMetodoEntrega', async (token, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/entregas/metodos`);
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

const metodoEntregaSlice = createSlice({
  name: 'metodoEntrega',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetodoEntrega.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMetodoEntrega.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchMetodoEntrega.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default metodoEntregaSlice.reducer; 
