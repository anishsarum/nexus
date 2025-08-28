import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true,
    port: 3000,
    open: false,
    proxy: {
      '/api': 'http://localhost:5001',
      '/pyapi': 'http://localhost:8000',
    },
  },
  build: {
    outDir: 'build',
  },
});
