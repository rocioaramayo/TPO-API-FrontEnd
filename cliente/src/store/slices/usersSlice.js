import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (token, { rejectWithValue, getState }) => {
  try {
    const res = await axios.get(`${API_URL}/api/v1/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
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

export const fetchUserInfo = createAsyncThunk('users/fetchUserInfo', async (token, { rejectWithValue }) => {
  try {
    const res = await axios.get('http://localhost:8080/api/v1/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const updateProfile = createAsyncThunk('users/updateProfile', async ({ token, firstName, lastName }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${API_URL}/api/v1/users/me`, { firstName, lastName }, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const changePassword = createAsyncThunk('users/changePassword', async ({ token, oldPassword, newPassword }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${API_URL}/api/v1/auth/change-password`, { oldPassword, newPassword }, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const adminChangeUserPassword = createAsyncThunk(
  'users/adminChangeUserPassword',
  async ({ token, email, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/api/v1/auth/admin/change-password`, {
        email,
        newPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Habilitar usuario
export const enableUser = createAsyncThunk('users/enableUser', async ({ token, id }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${API_URL}/api/v1/users/${id}/habilitar`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Deshabilitar usuario
export const disableUser = createAsyncThunk('users/disableUser', async ({ token, id }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${API_URL}/api/v1/users/${id}/deshabilitar`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
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
  userInfo: null,
  loadingUserInfo: false,
  errorUserInfo: null,
  updateProfileLoading: false,
  updateProfileError: null,
  updateProfileSuccess: false,
  changePasswordLoading: false,
  changePasswordError: null,
  changePasswordSuccess: false,
  enableUserLoading: false,
  enableUserError: null,
  enableUserSuccess: false,
  disableUserLoading: false,
  disableUserError: null,
  disableUserSuccess: false,
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
    clearUpdateProfileStatus: (state) => {
      state.updateProfileLoading = false;
      state.updateProfileError = null;
      state.updateProfileSuccess = false;
    },
    clearChangePasswordStatus: (state) => {
      state.changePasswordLoading = false;
      state.changePasswordError = null;
      state.changePasswordSuccess = false;
    },
    clearEnableDisableUserStatus: (state) => {
      state.enableUserLoading = false;
      state.enableUserError = null;
      state.enableUserSuccess = false;
      state.disableUserLoading = false;
      state.disableUserError = null;
      state.disableUserSuccess = false;
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
      })
      .addCase(fetchUserInfo.pending, (state) => {
        state.loadingUserInfo = true;
        state.errorUserInfo = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loadingUserInfo = false;
        state.userInfo = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loadingUserInfo = false;
        state.errorUserInfo = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.updateProfileLoading = true;
        state.updateProfileError = null;
        state.updateProfileSuccess = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateProfileLoading = false;
        state.updateProfileSuccess = true;
        // Actualiza los datos del usuario en el store
        if (state.user) {
          state.user.firstName = action.payload.firstName;
          state.user.lastName = action.payload.lastName;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateProfileLoading = false;
        state.updateProfileError = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.changePasswordLoading = true;
        state.changePasswordError = null;
        state.changePasswordSuccess = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.changePasswordLoading = false;
        state.changePasswordSuccess = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePasswordLoading = false;
        state.changePasswordError = action.payload;
      })
      .addCase(adminChangeUserPassword.pending, (state) => {
        state.changePasswordLoading = true;
        state.changePasswordError = null;
        state.changePasswordSuccess = false;
      })
      .addCase(adminChangeUserPassword.fulfilled, (state) => {
        state.changePasswordLoading = false;
        state.changePasswordSuccess = true;
      })
      .addCase(adminChangeUserPassword.rejected, (state, action) => {
        state.changePasswordLoading = false;
        state.changePasswordError = action.payload;
      })
      .addCase(enableUser.pending, (state) => {
        state.enableUserLoading = true;
        state.enableUserError = null;
        state.enableUserSuccess = false;
      })
      .addCase(enableUser.fulfilled, (state, action) => {
        state.enableUserLoading = false;
        state.enableUserSuccess = action.payload?.mensaje || true;
      })
      .addCase(enableUser.rejected, (state, action) => {
        state.enableUserLoading = false;
        state.enableUserError = action.payload;
        state.enableUserSuccess = false;
      })
      .addCase(disableUser.pending, (state) => {
        state.disableUserLoading = true;
        state.disableUserError = null;
        state.disableUserSuccess = false;
      })
      .addCase(disableUser.fulfilled, (state, action) => {
        state.disableUserLoading = false;
        state.disableUserSuccess = action.payload?.mensaje || true;
      })
      .addCase(disableUser.rejected, (state, action) => {
        state.disableUserLoading = false;
        state.disableUserError = action.payload;
        state.disableUserSuccess = false;
      });
  },
});

export const { clearAuthError, clearError, updateUser, setUser, clearUser, logout, clearUpdateProfileStatus, clearChangePasswordStatus, clearEnableDisableUserStatus } = usersSlice.actions;
export default usersSlice.reducer; 