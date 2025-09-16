import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'node:fs'

function readHttpsConfig() {
    try {
        const key = fs.readFileSync('./certs/dev-key.pem')
        const cert = fs.readFileSync('./certs/dev-cert.pem')
        return { key, cert }
    } catch {
        return null
    }
}

const httpsConfig = readHttpsConfig()

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            // nur falls ihr den SW auch im "npm run dev" braucht:
            // devOptions: { enabled: true, type: 'module' },
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

    server: {
        host: true,           // im LAN erreichbar
        https: httpsConfig || false
    },

    preview: {
        host: true,
        port: 4173,
        strictPort: true,
        https: httpsConfig || false,
        allowedHosts: true
    }
})
