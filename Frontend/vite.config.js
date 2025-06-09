import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

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
        background_color: '#feb47b',
        theme_color: '#feb47b',
        orientation: 'any',
        dir: 'auto',
        lang: 'en-US',
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
        ],
        screenshots: [
          {
            src: '/screenshots/Screenshot2.png',
            type: 'image/png',
            sizes: '1280x800',
            form_factor: 'wide'
          },
          {
            src: '/screenshots/Screenshot1.png',
            type: 'image/png',
            sizes: '375x667',
            form_factor: 'narrow'
          }
        ]
      }
    })
  ]
});
