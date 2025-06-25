import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filtros = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      // Append all filters that have a value
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      // Always add pagination and sorting defaults if not present
      if (!params.has('page')) params.append('page', '0');
      if (!params.has('size')) params.append('size', '100');
      if (!params.has('ordenarPor')) params.append('ordenarPor', 'nombre');
      if (!params.has('orden')) params.append('orden', 'asc');

      const response = await axios.get(`${API_URL}/productos/filtrar`, { params });
      
      // The paginated response has products in `content`
      return response.data.content || [];

    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar productos');
    }
  }
);

export const fetchAdminProducts = createAsyncThunk('products/fetchAdminProducts', async (token, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/productos/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log('Respuesta cruda de /productos/admin:', res.data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
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

// Thunk para obtener los tipos de cuero
export const fetchTiposCuero = createAsyncThunk(
  'products/fetchTiposCuero',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8080/productos/tipos-cuero`);
      if (!response.ok) throw new Error('No se pudo obtener los tipos de cuero.');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// Thunk para obtener los colores
export const fetchColores = createAsyncThunk(
  'products/fetchColores',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8080/productos/colores`);
      if (!response.ok) throw new Error('No se pudo obtener los colores.');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const createProduct = createAsyncThunk('products/createProduct', async({token,formData},{rejectWithValue}) =>{
  try{
    const response = await axios.post(`${API_URL}/productos/upload`,formData,{
      headers:{
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    })
    return response.data;
  } catch (error){
    const mensaje = error.response?.data?.message || error.message;
    return rejectWithValue(mensaje);
  }})

const initialState = {
  items: [],
  loading: false,
  error: null,
  selectedProduct: null, // Nuevo estado para el producto seleccionado
  tiposCuero: [], // Nuevo estado
  colores: [],      // Nuevo estado
  success: false,
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
        state.success = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
        state.success = null
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
        state.success = null
        state.error = null;
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
        state.success = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reducers para fetchTiposCuero
      .addCase(fetchTiposCuero.fulfilled, (state, action) => {
        state.tiposCuero = action.payload;
        state.error = null;
      })
      // Reducers para fetchColores
      .addCase(fetchColores.fulfilled, (state, action) => {
        state.colores = action.payload;
        state.error = null;
      })
      //reducers para createProduct
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null
      })
      .addCase(createProduct.rejected, (state, action) =>{
        state.error = action.payload;
        state.loading = false;
        state.success = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
  },
});

export default productsSlice.reducer; 