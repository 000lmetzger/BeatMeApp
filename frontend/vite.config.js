import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'node:fs'
import path from "path"
import { fileURLToPath } from "url";  // 🆕 Import ergänzen
import tailwindcss from "@tailwindcss/vite"

// 🆕 __dirname Fix:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
            manifest: {
                name: 'BeatMe',
                short_name: 'BeatMe',
                start_url: '/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#7c3aed',
                icons: [
                    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
                    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
                ]
            }
        }),
        tailwindcss()
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        host: true,
        https: httpsConfig || false
    },
    preview: {
        host: true,
        port: 4173,
        strictPort: true,
        https: httpsConfig || false,
        allowedHosts: true
    }
});
