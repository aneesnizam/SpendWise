import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'; 

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon512_maskable.png', 'icon512_rounded.png'],
      manifest: {
        name: 'SpendWise',
        short_name: 'spendWise',
        start_url: '/',
        display: 'standalone',
        background_color: '#2EC6FE',
        theme_color: '#8936FF',
        icons: [
          {
            src: 'icon512_maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'icon512_rounded.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      }
    })
  ]
})
