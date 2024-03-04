import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig(() => {
  return {
    base: './',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'look-router': fileURLToPath(new URL('../src', import.meta.url)),
        react: fileURLToPath(new URL('../node_modules/react', import.meta.url)),
        'react-dom': fileURLToPath(new URL('../node_modules/react-dom', import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          normal: resolve(__dirname, 'normal.html'),
        },
      },
    },
    plugins: [react(), svgr()],
  }
})
