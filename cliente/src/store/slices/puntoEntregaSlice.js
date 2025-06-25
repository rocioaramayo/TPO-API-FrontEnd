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

export const fetchPuntoEntregaActivos = createAsyncThunk('puntoEntrega/fetchPuntoEntregaActivos', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/entregas/puntos/activos`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const createPunto = createAsyncThunk('puntoEntrega/createPunto', async ({token, data}, {rejectWithValue}) =>{
  try {
    const res = await axios.post(`${API_URL}/entregas/puntos`, data, {
      headers:{
        Authorization : token? `Bearer ${token}` : '',
        "Content-Type": 'application/json',
      },
    });
    return res.data;
  } catch (error) {
    const mensaje = error.response?.data?.message || error.message;
    return rejectWithValue(mensaje);
  }
});

const initialState = {
  items: [],
  itemsAdmin: [],
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
        state.itemsAdmin = action.payload;
        state.error = null;
      })
      .addCase(fetchPuntoEntrega.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPuntoEntregaActivos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPuntoEntregaActivos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchPuntoEntregaActivos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPunto.fulfilled, (state) =>{
        state.loading = false;
        state.error = null;
      })
      .addCase(createPunto.pending, (state) =>{
        state.loading = true;
        state.error = null;
      })
      .addCase(createPunto.rejected, (state, action) =>{
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default puntoEntregaSlice.reducer; 
