import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['pwa-icon.svg'],
            manifest: {
                name: 'Neolit Language Learning',
                short_name: 'Neolit',
                description: 'Learn languages through lessons and games.',
                theme_color: '#102b31',
                background_color: '#071b1f',
                display: 'standalone',
                orientation: 'portrait',
                start_url: '/',
                icons: [
                    { src: '/pwa-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
                ],
            },
            workbox: {
                cleanupOutdatedCaches: true,
            },
        }),
    ],
    server: {
        port: 5173,
        host: '0.0.0.0'
    }
})
