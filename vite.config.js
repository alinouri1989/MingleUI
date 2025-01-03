import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    https: true, // Enables HTTPS support
  },
  plugins: [
    mkcert(), // For HTTPS with local certificates
    react(), // React plugin support
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern', // SCSS preprocessor options
      },
    },
  },
});