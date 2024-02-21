import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'look-router': fileURLToPath(new URL('../src', import.meta.url)),
      },
    },
    plugins: [react()],
  }
})
