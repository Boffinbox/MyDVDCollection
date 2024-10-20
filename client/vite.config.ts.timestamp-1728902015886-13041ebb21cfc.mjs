// vite.config.ts
import { defineConfig } from "file:///C:/Users/Adam/Desktop/WebDev/MyDVDCollection/client/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Adam/Desktop/WebDev/MyDVDCollection/client/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { TanStackRouterVite } from "file:///C:/Users/Adam/Desktop/WebDev/MyDVDCollection/client/node_modules/@tanstack/router-vite-plugin/dist/esm/index.js";
var vite_config_default = defineConfig({
  plugins: [react(), TanStackRouterVite()],
  server: {
    port: 3e3,
    proxy: {
      "/api": {
        target: "https://localhost:5000",
        changeOrigin: true,
        secure: false
      }
    },
    https: {
      key: "certs/localhost-key.pem",
      cert: "certs/localhost.pem"
    }
  },
  optimizeDeps: {
    exclude: ["@preflower/barcode-detector-polyfill"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBZGFtXFxcXERlc2t0b3BcXFxcV2ViRGV2XFxcXE15RFZEQ29sbGVjdGlvblxcXFxjbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEFkYW1cXFxcRGVza3RvcFxcXFxXZWJEZXZcXFxcTXlEVkRDb2xsZWN0aW9uXFxcXGNsaWVudFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvQWRhbS9EZXNrdG9wL1dlYkRldi9NeURWRENvbGxlY3Rpb24vY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgeyBUYW5TdGFja1JvdXRlclZpdGUgfSBmcm9tIFwiQHRhbnN0YWNrL3JvdXRlci12aXRlLXBsdWdpblwiXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gICAgcGx1Z2luczogW3JlYWN0KCksIFRhblN0YWNrUm91dGVyVml0ZSgpXSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICAgIHBvcnQ6IDMwMDAsXHJcbiAgICAgICAgcHJveHk6IHtcclxuICAgICAgICAgICAgXCIvYXBpXCI6IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldDogXCJodHRwczovL2xvY2FsaG9zdDo1MDAwXCIsXHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzZWN1cmU6IGZhbHNlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGh0dHBzOiB7XHJcbiAgICAgICAgICAgIGtleTogXCJjZXJ0cy9sb2NhbGhvc3Qta2V5LnBlbVwiLFxyXG4gICAgICAgICAgICBjZXJ0OiBcImNlcnRzL2xvY2FsaG9zdC5wZW1cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvcHRpbWl6ZURlcHM6IHtcclxuICAgICAgICBleGNsdWRlOiBbJ0BwcmVmbG93ZXIvYmFyY29kZS1kZXRlY3Rvci1wb2x5ZmlsbCddXHJcbiAgICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVYsU0FBUyxvQkFBb0I7QUFDdFgsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsMEJBQTBCO0FBR25DLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsbUJBQW1CLENBQUM7QUFBQSxFQUN2QyxRQUFRO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDSCxRQUFRO0FBQUEsUUFDSixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsTUFDWjtBQUFBLElBQ0o7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNILEtBQUs7QUFBQSxNQUNMLE1BQU07QUFBQSxJQUNWO0FBQUEsRUFDSjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1YsU0FBUyxDQUFDLHNDQUFzQztBQUFBLEVBQ3BEO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
