import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '.',
    entry: 'renderer.jsx',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'renderer.jsx')
      },
      output: {
        entryFileNames: 'renderer.bundle.js',
        assetFileNames: 'index.css'
      }
    }
  }
});