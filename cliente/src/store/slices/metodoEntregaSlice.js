import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
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

export const fetchMetodoEntregaActivos = createAsyncThunk('metodoEntrega/fetchMetodoEntregaActivos', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/entregas/metodos/activos`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const cotizarEnvio = createAsyncThunk('metodoEntrega/cotizarEnvio', async ({ token, direccion }, { rejectWithValue }) => {
  try {
    const res = await axios.post('http://localhost:8080/entregas/cotizar', direccion, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const limpiarCotizacion = createAction('metodoEntrega/limpiarCotizacion');

const initialState = {
  items: [],
  loading: false,
  error: null,
  cotizacion: null,
  cotizando: false,
  errorCotizacion: null,
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
      .addCase(fetchMetodoEntregaActivos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMetodoEntregaActivos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchMetodoEntregaActivos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cotizarEnvio.pending, (state) => {
        state.cotizando = true;
        state.errorCotizacion = null;
        state.cotizacion = null;
      })
      .addCase(cotizarEnvio.fulfilled, (state, action) => {
        state.cotizando = false;
        state.cotizacion = action.payload;
        state.errorCotizacion = null;
      })
      .addCase(cotizarEnvio.rejected, (state, action) => {
        state.cotizando = false;
        state.errorCotizacion = action.payload;
        state.cotizacion = null;
      })
      .addCase(limpiarCotizacion, (state) => {
        state.cotizacion = null;
        state.cotizando = false;
        state.errorCotizacion = null;
      });
  },
});

export default metodoEntregaSlice.reducer; 
