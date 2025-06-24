import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const fetchDirecciones = createAsyncThunk('direccion/fetchDirecciones', async (token, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/direcciones/mias`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const crearDireccion = createAsyncThunk('direccion/crearDireccion', async ({ token, data }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/direcciones`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const desactivarDireccion = createAsyncThunk('direccion/desactivarDireccion', async ({ token, id }, { rejectWithValue }) => {
  try {
    await axios.put(`${API_URL}/direcciones/${id}/desactivar`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const initialState = {
  items: [],
  loading: false,
  error: null,
  success: false,
  loadingDesactivar: false,
  errorDesactivar: null,
};

const direccionSlice = createSlice({
  name: 'direccion',
  initialState,
  reducers: {
    limpiarEstadoDireccion: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDirecciones.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchDirecciones.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchDirecciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(crearDireccion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(crearDireccion.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(crearDireccion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(desactivarDireccion.pending, (state) => {
        state.loadingDesactivar = true;
        state.errorDesactivar = null;
      })
      .addCase(desactivarDireccion.fulfilled, (state, action) => {
        state.loadingDesactivar = false;
        state.errorDesactivar = null;
        state.items = state.items.filter(dir => dir.id !== action.payload);
      })
      .addCase(desactivarDireccion.rejected, (state, action) => {
        state.loadingDesactivar = false;
        state.errorDesactivar = action.payload;
      });
  },
});

export const { limpiarEstadoDireccion } = direccionSlice.actions;
export default direccionSlice.reducer;