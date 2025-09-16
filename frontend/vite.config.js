// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            manifest: {
                name: 'BeatMe',
                short_name: 'BeatMe',
                start_url: '/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#ffffff',
                icons: [
                    { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
                    { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
                ]
            }
        })
    ],

    preview: {
        host: true,
        port: 4173,
        strictPort: true,
        allowedHosts: [
            'thickness-overnight-yeast-accomplished.trycloudflare.com'
        ]
    }
})
