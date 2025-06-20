import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (filtros = {}, { rejectWithValue }) => {
  try {
    // Si no hay filtros activos, usar GET /productos
    const tieneFiltros = Object.entries(filtros).some(
      ([k, v]) => v && v !== '' && k !== 'ordenarPor' && k !== 'orden'
    );
    if (!tieneFiltros) {
      // GET /productos (devuelve ProductPageResponse)
      const res = await axios.get(`${API_URL}/productos`);
      // El array de productos está en res.data.productos
      return res.data.productos || [];
    } else {
      // Si hay filtros, usar /productos/filtrar
      const params = new URLSearchParams();
      if (filtros.nombre) params.append('nombre', filtros.nombre);
      if (filtros.categoriaId) params.append('categoriaId', filtros.categoriaId);
      if (filtros.tipoCuero) params.append('tipoCuero', filtros.tipoCuero);
      if (filtros.color) params.append('color', filtros.color);
      if (filtros.precioMin) params.append('precioMin', filtros.precioMin);
      if (filtros.precioMax) params.append('precioMax', filtros.precioMax);
      params.append('ordenarPor', filtros.ordenarPor || 'nombre');
      params.append('orden', filtros.orden || 'asc');
      params.append('size', '50');
      const url = `${API_URL}/productos/filtrar?${params.toString()}`;
      const res = await axios.get(url);
      // El array de productos está en res.data.content
      return res.data.content || [];
    }
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchAdminProducts = createAsyncThunk('products/fetchAdminProducts', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/productos/admin`);
    console.log('Respuesta cruda de /productos/admin:', res.data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

// Thunk para obtener un producto por su ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8080/productos/detalle/${id}`);
      if (!response.ok) {
        throw new Error('No se pudo obtener el producto.');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  selectedProduct: null, // Nuevo estado para el producto seleccionado
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload.productos)
          ? action.payload.productos
          : [];
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reducers para fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.selectedProduct = null;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer; 