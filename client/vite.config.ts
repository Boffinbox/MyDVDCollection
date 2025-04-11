import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from "@tanstack/router-vite-plugin"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), TanStackRouterVite()],
    server: {
        port: 3000,
        proxy: {
            "/api": {
                target: "https://mydvdcollection-server.onrender.com",
                changeOrigin: true,
            }
        }
        // proxy: {
        //     "/api": {
        //         target: "https://mydvdcollection-server.onrender.com",
        //         changeOrigin: true,
        //         secure: false
        //     }
        // },
        // https: {
        //     key: "certs/localhost-key.pem",
        //     cert: "certs/localhost.pem"
        // }
    },
    optimizeDeps: {
        exclude: ['@preflower/barcode-detector-polyfill']
    }
})
