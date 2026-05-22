import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/authSlice';
import products from './slices/productSlice';
import cart from './slices/cartSlice';
import wishlist from './slices/wishlistSlice';
import ui from './slices/uiSlice';
export const store = configureStore({ reducer: { auth, products, cart, wishlist, ui } });
