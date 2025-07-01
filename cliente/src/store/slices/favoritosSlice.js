import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getToken = (getState) => {
    const { user } = getState().users;
    return user?.token;
}

// Thunk para obtener la lista de favoritos (solo IDs)
export const fetchFavoritos = createAsyncThunk(
    'favoritos/fetchFavoritos',
    async (_, { getState, rejectWithValue }) => {
        const token = getToken(getState);
        if (!token) return rejectWithValue('No hay token');
        try {
            const response = await axios.get('http://localhost:8080/api/v1/favoritos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!Array.isArray(response.data)) {
                return rejectWithValue('La respuesta de favoritos no es un array');
            }
            // Filtrar y mapear solo los favoritos válidos
            const productosFavoritos = response.data
                .filter(fav => fav.producto && fav.producto.id)
                .map(fav => fav.producto.id);
            return productosFavoritos;
        } catch (error) {
            const mensaje = error.response?.data?.message || error.message || "Error al cargar favoritos";
            return rejectWithValue(mensaje);
        }
    }
);

// Thunk para agregar un favorito
export const addFavorito = createAsyncThunk(
    'favoritos/addFavorito',
    async (productoId, { getState, rejectWithValue }) => {
        const token = getToken(getState);
        if (!token) return rejectWithValue('No hay token');
        try {
            const response = await axios.post('http://localhost:8080/api/v1/favoritos', { productoId }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.producto.id; // Devolvemos el ID del producto agregado
        } catch (error) {
            const mensaje = error.response?.data?.message || error.message || "Error al agregar favorito";
            return rejectWithValue(mensaje);
        }
    }
);

// Thunk para eliminar un favorito
export const removeFavorito = createAsyncThunk(
    'favoritos/removeFavorito',
    async (productoId, { getState, rejectWithValue }) => {
        const token = getToken(getState);
        if (!token) return rejectWithValue('No hay token');
        try {
            await axios.delete(`http://localhost:8080/api/v1/favoritos/${productoId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return productoId; // Devolvemos el ID del producto eliminado
        } catch (error) {
            const mensaje = error.response?.data?.message || error.message || "Error al eliminar favorito";
            return rejectWithValue(mensaje);
        }
    }
);

// Thunk para obtener la lista de favoritos COMPLETA (para la página de Favoritos)
export const fetchFavoritosCompletos = createAsyncThunk(
    'favoritos/fetchFavoritosCompletos',
    async (_, { getState, rejectWithValue }) => {
        const token = getToken(getState);
        if (!token) return rejectWithValue('No hay token');
        try {
            const response = await axios.get('http://localhost:8080/api/v1/favoritos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!Array.isArray(response.data)) {
                return rejectWithValue('La respuesta de favoritos no es un array');
            }
            return response.data; // Devuelve la lista completa de objetos favoritos
        } catch (error) {
            const mensaje = error.response?.data?.message || error.message || "Error al cargar favoritos";
            return rejectWithValue(mensaje);
        }
    }
);

const favoritosSlice = createSlice({
    name: 'favoritos',
    initialState: {
        ids: [],
        items: [], // Para la lista completa en la página de favoritos
        loading: false,
        error: null,
    },
    reducers: {
        clearFavoritos: (state) => {
            state.ids = [];
            state.items = [];
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Favoritos (solo IDs)
            .addCase(fetchFavoritos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFavoritos.fulfilled, (state, action) => {
                state.loading = false;
                state.ids = action.payload;
                state.error = null;
            })
            .addCase(fetchFavoritos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Favorito
            .addCase(addFavorito.fulfilled, (state, action) => {
                if (!state.ids.includes(action.payload)) {
                    state.ids = [...state.ids, action.payload];
                }
            })
            // Remove Favorito - también quita de 'items'
            .addCase(removeFavorito.fulfilled, (state, action) => {
                state.ids = state.ids.filter(id => id !== action.payload);
                state.items = state.items.filter(item => item.producto.id !== action.payload);
            })
            // Fetch Favoritos Completos
            .addCase(fetchFavoritosCompletos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFavoritosCompletos.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                // También actualizamos los IDs para mantener la consistencia
                state.ids = action.payload.map(fav => fav.producto.id);
                state.error = null;
            })
            .addCase(fetchFavoritosCompletos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearFavoritos } = favoritosSlice.actions;
export default favoritosSlice.reducer; 