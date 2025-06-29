import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Obtener todos los descuentos (admin)
export const fetchDescuentos = createAsyncThunk(
  'descuentos/fetchDescuentos',
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/descuentos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Crear descuento
export const createDescuento = createAsyncThunk(
  'descuentos/createDescuento',
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/descuentos`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Editar descuento
export const updateDescuento = createAsyncThunk(
  'descuentos/updateDescuento',
  async ({ token, id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/descuentos/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { id, ...data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Eliminar descuento
export const deleteDescuento = createAsyncThunk(
  'descuentos/deleteDescuento',
  async ({ token, id }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/descuentos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Activar descuento
export const activarDescuento = createAsyncThunk(
  'descuentos/activarDescuento',
  async ({ token, id }, { rejectWithValue }) => {
    try {
      await axios.put(`${API_URL}/descuentos/${id}/activar`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Desactivar descuento
export const desactivarDescuento = createAsyncThunk(
  'descuentos/desactivarDescuento',
  async ({ token, id }, { rejectWithValue }) => {
    try {
      await axios.put(`${API_URL}/descuentos/${id}/desactivar`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Validar cupón de descuento (para checkout)
export const validarCupon = createAsyncThunk(
  'descuentos/validarCupon',
  async ({ token, codigoDescuento, items }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/descuentos/validar`,
        { codigoDescuento, items },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  createError: null,
  createSuccess: null,
  cupon: {
    loading: false,
    error: null,
    resultado: null,
  },
};

const descuentosSlice = createSlice({
  name: 'descuentos',
  initialState,
  reducers: {
    limpiarCupon: (state) => {
      state.cupon = { loading: false, error: null, resultado: null };
    },
    limpiarCreateSuccess: (state) => {
      state.createSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch descuentos
      .addCase(fetchDescuentos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDescuentos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchDescuentos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Crear descuento
      .addCase(createDescuento.pending, (state) => {
        state.loading = true;
        state.createError = null;
        state.createSuccess = null;
      })
      .addCase(createDescuento.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [...state.items, action.payload];
        state.createSuccess = 'Descuento creado exitosamente';
        state.createError = null;
      })
      .addCase(createDescuento.rejected, (state, action) => {
        state.loading = false;
        state.createError = action.payload;
        state.createSuccess = null;
      })
      // Editar descuento
      .addCase(updateDescuento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDescuento.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map(d => d.id === action.payload.id ? { ...d, ...action.payload } : d);
      })
      .addCase(updateDescuento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Eliminar descuento
      .addCase(deleteDescuento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDescuento.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(d => d.id !== action.payload);
      })
      .addCase(deleteDescuento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Activar descuento
      .addCase(activarDescuento.fulfilled, (state, action) => {
        state.items = state.items.map(d => d.id === action.payload ? { ...d, activo: true } : d);
      })
      // Desactivar descuento
      .addCase(desactivarDescuento.fulfilled, (state, action) => {
        state.items = state.items.map(d => d.id === action.payload ? { ...d, activo: false } : d);
      })
      // Validar cupón
      .addCase(validarCupon.pending, (state) => {
        state.cupon.loading = true;
        state.cupon.error = null;
        state.cupon.resultado = null;
      })
      .addCase(validarCupon.fulfilled, (state, action) => {
        state.cupon.loading = false;
        state.cupon.resultado = action.payload;
      })
      .addCase(validarCupon.rejected, (state, action) => {
        state.cupon.loading = false;
        state.cupon.error = action.payload;
      });
  },
});

export const { limpiarCupon, limpiarCreateSuccess } = descuentosSlice.actions;
export default descuentosSlice.reducer; 