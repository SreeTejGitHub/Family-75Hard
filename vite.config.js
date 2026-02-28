import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      // 🔥 Enable PWA in dev mode
      // devOptions: {
      //   enabled: true
      // },

      manifest: {
        name: 'My Challenge Tracker',
        short_name: 'MCT',
        description: 'Track your habits. Build discipline.',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',

        icons: [
          {
            src: '/icon-196.png',   // 🔥 must actually be 192x192 file
            sizes: '196x196',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})