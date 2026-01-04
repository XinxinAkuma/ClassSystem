import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:2830',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        ws: true, // 关键：添加这一行，开启 WebSocket 代理支持
      },
    },
    // 补充：显式配置 HMR，确保 WebSocket 连接稳定
    hmr: {
      host: 'localhost',
      port: 3000,
      protocol: 'ws',
      overlay: true, // 编译错误时显示页面提示，便于排查
    },
  },
})