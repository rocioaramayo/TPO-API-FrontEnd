import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Fetch todas las categorías
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/categories`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

// Obtener una categoría por ID
export const getCategoryById = createAsyncThunk('categories/getCategoryById', async (id, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/categories/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

// Crear nueva categoría
export const createCategory = createAsyncThunk('categories/createCategory', async (categoryData, { rejectWithValue, getState }) => {
  try {
    const { user } = getState().users;
    const res = await axios.post(`${API_URL}/categories/create`, categoryData, {
      headers: {
        'Authorization': `Bearer ${user?.token}`
      }
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

// ✅ Editar categoría existente
export const updateCategory = createAsyncThunk('categories/updateCategory', async ({ id, nombre, descripcion }, { rejectWithValue, getState }) => {
  try {
    const { user } = getState().users;
    const res = await axios.put(`${API_URL}/categories/${id}`, { nombre, descripcion }, {
      headers: {
        'Authorization': `Bearer ${user?.token}`
      }
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const initialState = {
  items: [],
  selectedCategory: null,
  loading: false,
  error: null,
  createError: null,
  createSuccess: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
        // Fetch
        .addCase(fetchCategories.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchCategories.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload;
        })
        .addCase(fetchCategories.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // Get by ID
        .addCase(getCategoryById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getCategoryById.fulfilled, (state, action) => {
          state.loading = false;
          state.selectedCategory = action.payload;
        })
        .addCase(getCategoryById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // Create
        .addCase(createCategory.pending, (state) => {
          state.loading = true;
          state.createError = null;
          state.createSuccess = null;
        })
        .addCase(createCategory.fulfilled, (state, action) => {
          state.loading = false;
          state.items.push(action.payload);
          state.createSuccess = 'Categoría creada exitosamente';
          state.createError = null;
        })
        .addCase(createCategory.rejected, (state, action) => {
          state.loading = false;
          state.createError = action.payload?.message || action.payload || 'Error al crear la categoría';
          state.createSuccess = null;
        })

        // ✅ Update
        .addCase(updateCategory.pending, (state) => {
          state.loading = true;
          state.createError = null;
          state.createSuccess = null;
        })
        .addCase(updateCategory.fulfilled, (state, action) => {
          state.loading = false;
          const index = state.items.findIndex(c => c.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
          state.createSuccess = 'Categoría actualizada exitosamente';
          state.createError = null;
        })
        .addCase(updateCategory.rejected, (state, action) => {
          state.loading = false;
          state.createError = action.payload?.message || action.payload || 'Error al actualizar la categoría';
          state.createSuccess = null;
        });
  },
});

export const { clearSelectedCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
