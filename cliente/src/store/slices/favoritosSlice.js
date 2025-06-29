import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const getToken = (getState) => {
    const { user } = getState().users;
    return user?.token;
}

// Thunk para obtener la lista de favoritos
export const fetchFavoritos = createAsyncThunk(
    'favoritos/fetchFavoritos',
    async (_, { getState, rejectWithValue }) => {
        const token = getToken(getState);
        if (!token) return rejectWithValue('No hay token');
        try {
            const response = await fetch('http://localhost:8080/api/v1/favoritos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al cargar favoritos');
            const data = await response.json();
            // Devolvemos solo los IDs para un estado más ligero
            return data.map(fav => fav.producto.id); 
        } catch (error) {
            return rejectWithValue(error.toString());
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
            const response = await fetch('http://localhost:8080/api/v1/favoritos', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productoId })
            });
            if (!response.ok) throw new Error('Error al agregar favorito');
            const data = await response.json();
            return data.producto.id; // Devolvemos el ID del producto agregado
        } catch (error) {
            return rejectWithValue(error.toString());
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
            const response = await fetch(`http://localhost:8080/api/v1/favoritos/${productoId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al eliminar favorito');
            return productoId; // Devolvemos el ID del producto eliminado
        } catch (error) {
            return rejectWithValue(error.toString());
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
            const response = await fetch('http://localhost:8080/api/v1/favoritos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al cargar favoritos');
            const data = await response.json();
            return data; // Devuelve la lista completa de objetos favoritos
        } catch (error) {
            return rejectWithValue(error.toString());
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
            // Fetch Favoritos
            .addCase(fetchFavoritos.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFavoritos.fulfilled, (state, action) => {
                state.loading = false;
                state.ids = action.payload;
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
            // Remove Favorito - ACTUALIZADO para que también quite de 'items'
            .addCase(removeFavorito.fulfilled, (state, action) => {
                state.ids = state.ids.filter(id => id !== action.payload);
                state.items = state.items.filter(item => item.producto.id !== action.payload);
            })
            // Fetch Favoritos Completos
            .addCase(fetchFavoritosCompletos.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFavoritosCompletos.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                // También actualizamos los IDs para mantener la consistencia
                state.ids = action.payload.map(fav => fav.producto.id);
            })
            .addCase(fetchFavoritosCompletos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearFavoritos } = favoritosSlice.actions;
export default favoritosSlice.reducer; 