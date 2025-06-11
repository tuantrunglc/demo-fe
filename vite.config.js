import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://backend:8000',
          changeOrigin: true
        }
      }
    },
    build: {
      // Cấu hình build cho production
      outDir: 'dist',
      assetsDir: 'assets',
      // Tạo sourcemap cho production để dễ debug
      sourcemap: mode === 'production' ? false : true,
    },
    // Thêm base URL cho production nếu cần
    base: mode === 'production' ? '/' : '/',
  }
})
