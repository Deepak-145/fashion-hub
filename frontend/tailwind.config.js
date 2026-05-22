export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#b91c1c', dark: '#7f1d1d', light: '#fecaca' },
      },
      fontFamily: { display: ['Poppins','sans-serif'] },
    },
  },
  plugins: [],
};
