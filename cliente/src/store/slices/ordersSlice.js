import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (token, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/compras`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMyOrders', async (token, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/compras/mias`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchOrderDetail = createAsyncThunk('orders/fetchOrderDetail', async ({ token, id }, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/compras/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const createOrder = createAsyncThunk('orders/createOrder', async ({ token, data }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/compras`, data, {
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

const initialState = {
  items: [],
  loading: false,
  error: null,
  myOrders: [],
  loadingMyOrders: false,
  errorMyOrders: null,
  orderDetail: null,
  loadingOrderDetail: false,
  errorOrderDetail: null,
  loadingCreateOrder: false,
  errorCreateOrder: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.loadingMyOrders = true;
        state.errorMyOrders = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loadingMyOrders = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loadingMyOrders = false;
        state.errorMyOrders = action.payload;
      })
      .addCase(fetchOrderDetail.pending, (state) => {
        state.loadingOrderDetail = true;
        state.errorOrderDetail = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.loadingOrderDetail = false;
        state.orderDetail = action.payload;
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.loadingOrderDetail = false;
        state.errorOrderDetail = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.loadingCreateOrder = true;
        state.errorCreateOrder = null;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.loadingCreateOrder = false;
        state.errorCreateOrder = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loadingCreateOrder = false;
        state.errorCreateOrder = action.payload;
      });
  },
});

export default ordersSlice.reducer; 