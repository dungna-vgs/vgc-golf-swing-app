import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: 'default',
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: '**/*.svg',
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://api-swing.dev.vgcorp.vn/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/resource': {
        target: 'https://files.golffix.dev.vgcorp.vn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/resource/, ''),
      },
    },
  },
});
