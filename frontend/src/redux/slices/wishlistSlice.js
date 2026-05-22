import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
export const loadWishlist = createAsyncThunk('wl/load', async () => (await api.get('/wishlist')).data);
export const toggleWishlist = createAsyncThunk('wl/toggle', async (productId) => (await api.post('/wishlist/toggle', { productId })).data);
const slice = createSlice({
  name: 'wishlist', initialState: { products: [] }, reducers: {},
  extraReducers: (b) => {
    b.addCase(loadWishlist.fulfilled, (s,a) => { s.products = a.payload.products || []; });
    b.addCase(toggleWishlist.fulfilled, (s,a) => { s.products = a.payload.products || []; });
  }
});
export default slice.reducer;
