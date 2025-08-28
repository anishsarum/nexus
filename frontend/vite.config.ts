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
        '/api': 'http://backend:5001',
        '/pyapi': {
          target: 'http://python-backend:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/pyapi/, ''),
        },
      },
  },
  build: {
    outDir: 'build',
  },
});
