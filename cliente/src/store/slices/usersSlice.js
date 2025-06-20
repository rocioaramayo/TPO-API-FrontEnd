import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue, getState }) => {
  try {
    const { user } = getState().users;
    const res = await axios.get(`${API_URL}/api/v1/users`, {
      headers: {
        'Authorization': `Bearer ${user?.token}`
      }
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    // 1. Iniciar sesión y obtener el token
    const loginRes = await axios.post(`${API_URL}/api/v1/auth/login`, credentials);
    const { token } = loginRes.data;

    if (!token) {
      return rejectWithValue('No se recibió el token');
    }

    // 2. Usar el token para obtener los detalles del usuario
    const userDetailsRes = await axios.get(`${API_URL}/api/v1/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // 3. Combinar el token con los detalles del usuario
    const user = { ...userDetailsRes.data, token };
    
    return user;
  } catch (err) {
    const error = err.response?.data || { message: err.message };
    return rejectWithValue(error);
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    // 1. Registrar y obtener token
    const registerRes = await axios.post(`${API_URL}/api/v1/auth/register`, userData);
    const { token } = registerRes.data;

    if (!token) {
      return rejectWithValue('No se recibió el token de registro');
    }

    // 2. Usar el token para obtener los detalles del usuario
    const userDetailsRes = await axios.get(`${API_URL}/api/v1/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // 3. Combinar token y detalles del usuario
    const user = { ...userDetailsRes.data, token };

    return user;
  } catch (err) {
    const error = err.response?.data || { message: err.message };
    return rejectWithValue(error);
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    // Solo limpiar el estado, sin localStorage
    return null;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  // Estado para gestión de usuarios (admin)
  items: [],
  loading: false,
  error: null,
  
  // Estado para autenticación
  user: null,
  isAuthenticated: false,
  authLoading: false,
  authError: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.authError = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.authError = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.authError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Gestión de usuarios (admin)
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Autenticación - Login
      .addCase(loginUser.pending, (state) => {
        state.authLoading = true;
        state.authError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authLoading = false;
        // El payload ahora es el objeto de usuario completo con el token
        state.user = action.payload; 
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authLoading = false;
        state.authError = action.payload;
      })
      
      // Autenticación - Register
      .addCase(registerUser.pending, (state) => {
        state.authLoading = true;
        state.authError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.authLoading = false;
        // El payload ahora es el objeto de usuario completo con el token
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.authLoading = false;
        state.authError = action.payload;
      })
      
      // Autenticación - Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.authError = null;
      });
  },
});

export const { clearAuthError, clearError, updateUser, setUser, clearUser, logout } = usersSlice.actions;
export default usersSlice.reducer; 