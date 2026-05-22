import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const loadCart = createAsyncThunk('cart/load', async () => (await api.get('/cart')).data);
export const addToCart = createAsyncThunk('cart/add', async (item) => (await api.post('/cart', item)).data);
export const updateCartItem = createAsyncThunk('cart/update', async ({ itemId, quantity }) => (await api.put(`/cart/${itemId}`, { quantity })).data);
export const removeCartItem = createAsyncThunk('cart/remove', async (itemId) => (await api.delete(`/cart/${itemId}`)).data);
export const clearCart = createAsyncThunk('cart/clear', async () => { await api.delete('/cart'); return { items: [] }; });

const slice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false },
  reducers: { resetCart(s) { s.items = []; } },
  extraReducers: (b) => {
    [loadCart, addToCart, updateCartItem, removeCartItem, clearCart].forEach(t => {
      b.addCase(t.fulfilled, (s, a) => { s.items = a.payload.items || []; });
    });
  }
});
export const { resetCart } = slice.actions;
export default slice.reducer;
