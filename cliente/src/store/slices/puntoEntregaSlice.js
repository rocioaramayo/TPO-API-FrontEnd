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

// ✅ DELETE punto de entrega
export const deletePuntoEntrega = createAsyncThunk(
  'puntoEntrega/deletePuntoEntrega',
  async ({ id, token }, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/entregas/puntos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchPuntoEntrega(token));
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ ACTIVAR punto de entrega
export const activatePuntoEntrega = createAsyncThunk(
  'puntoEntrega/activatePuntoEntrega',
  async ({ id, token }, { dispatch, rejectWithValue }) => {
    try {
      await axios.put(`${API_URL}/entregas/puntos/${id}/activar`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchPuntoEntrega(token));
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

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
      .addCase(createPunto.pending, (state) =>{
        state.loading = true;
        state.error = null;
      })
      .addCase(createPunto.fulfilled, (state) =>{
        state.loading = false;
        state.error = null;
      })
      .addCase(createPunto.rejected, (state, action) =>{
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ deletePuntoEntrega
      .addCase(deletePuntoEntrega.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePuntoEntrega.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deletePuntoEntrega.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ activatePuntoEntrega
      .addCase(activatePuntoEntrega.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activatePuntoEntrega.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(activatePuntoEntrega.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default puntoEntregaSlice.reducer;
