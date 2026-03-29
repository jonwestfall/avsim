import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Change BASE_PATH if you deploy to a different GitHub repo path.
const BASE_PATH = process.env.VITE_BASE_PATH || '/avsim/';

export default defineConfig({
  base: BASE_PATH,
  plugins: [react()]
});
