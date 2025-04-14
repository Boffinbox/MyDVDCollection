import { defineConfig, ServerOptions } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from "@tanstack/router-vite-plugin"

let server: ServerOptions =
{
    port: 3000,
    proxy: {
        "/api": {
            target: `${process.env.VITE_API_URL}`,
            changeOrigin: true,
            secure: false
        }
    },
    https: {
        key: "certs/localhost-key.pem",
        cert: "certs/localhost.pem"
    }
}

if (process.env.NODE_ENV == "production")
{
    server =
    {
        port: 3000
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), TanStackRouterVite()],
    server,
    optimizeDeps: {
        exclude: ['@preflower/barcode-detector-polyfill']
    }
})
