import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  server:{
    allowedHosts: [
      '6bbdda402ac7.ngrok-free.app',
      'cc28-2806-2f0-63e1-faf6-916e-3a48-d0b9-55ec.ngrok-free.app'
      , '0845-2806-2f0-63e1-faf6-916e-3a48-d0b9-55ec.ngrok-free.app'
    ]
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
