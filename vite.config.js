import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Set VITE_BASE=/subfolder/ when the site is not served from the domain root.
export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: mode !== 'production',
    rollupOptions: {
      output: {
        // Keep the framework in its own long-cached chunk; pages are split by route.
        manualChunks: { vendor: ['react', 'react-dom', 'react-router-dom'] },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
}));
