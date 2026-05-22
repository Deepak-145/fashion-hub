import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchProducts = createAsyncThunk('products/fetch', async (params = {}) => {
  const r = await api.get('/products', { params }); return r.data;
});
export const fetchProduct = createAsyncThunk('products/fetchOne', async (id) => {
  const r = await api.get(`/products/${id}`); return r.data;
});

const slice = createSlice({
  name: 'products',
  initialState: { items: [], total: 0, current: null, loading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProducts.pending, (s) => { s.loading = true; });
    b.addCase(fetchProducts.fulfilled, (s, a) => { s.loading = false; s.items = a.payload.items; s.total = a.payload.total; });
    b.addCase(fetchProducts.rejected, (s) => { s.loading = false; });
    b.addCase(fetchProduct.fulfilled, (s, a) => { s.current = a.payload; });
  }
});
export default slice.reducer;
