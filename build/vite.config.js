import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    entry: 'renderer.jsx',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'renderer.jsx')
      },
      output: {
        entryFileNames: 'renderer.bundle.js',
        assetFileNames: 'index.css',
        format: 'iife',
        name: 'ResumeRenderer'
      }
    }
  }
});