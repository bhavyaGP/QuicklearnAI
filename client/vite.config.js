import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_GEN_PROXY,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
      },
    },
    define: {
      __VITE_GEN_PROXY__: JSON.stringify(env.VITE_GEN_PROXY),
      __VITE_PROXY_API_URL__: JSON.stringify(env.VITE_PROXY_API_URL),
      __VITE_API_URL__: JSON.stringify(env.VITE_API_URL),
      __VITE_SOCKET_URL__: JSON.stringify(env.VITE_SOCKET_URL),
    }
  }
})