import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
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
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(process.cwd(), 'src') }],
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/resource': {
          target: process.env.VITE_RESOURCE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/resource/, ''),
        },
      },
    },
  });
};
