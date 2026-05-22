import { createSlice } from '@reduxjs/toolkit';
const dark = localStorage.getItem('theme') === 'dark';
if (dark) document.documentElement.classList.add('dark');
const slice = createSlice({
  name: 'ui', initialState: { dark },
  reducers: {
    toggleDark(s) {
      s.dark = !s.dark;
      document.documentElement.classList.toggle('dark', s.dark);
      localStorage.setItem('theme', s.dark ? 'dark' : 'light');
    }
  }
});
export const { toggleDark } = slice.actions;
export default slice.reducer;
