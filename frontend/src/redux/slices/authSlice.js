import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const userJson = localStorage.getItem('user');
const initialState = { user: userJson ? JSON.parse(userJson) : null, loading: false, error: null };

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try { const r = await api.post('/auth/login', data); return r.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Login failed'); }
});
export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try { const r = await api.post('/auth/register', data); return r.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Register failed'); }
});

const slice = createSlice({
  name: 'auth', initialState,
  reducers: {
    logout(s) { s.user = null; localStorage.removeItem('user'); localStorage.removeItem('token'); },
    setUser(s, a) { s.user = a.payload; localStorage.setItem('user', JSON.stringify(a.payload)); },
  },
  extraReducers: (b) => {
    const handle = (s, a) => {
      s.loading = false; s.user = a.payload;
      localStorage.setItem('user', JSON.stringify(a.payload));
      localStorage.setItem('token', a.payload.token);
    };
    b.addCase(login.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(login.fulfilled, handle);
    b.addCase(login.rejected, (s,a) => { s.loading = false; s.error = a.payload; });
    b.addCase(register.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(register.fulfilled, handle);
    b.addCase(register.rejected, (s,a) => { s.loading = false; s.error = a.payload; });
  }
});
export const { logout, setUser } = slice.actions;
export default slice.reducer;
