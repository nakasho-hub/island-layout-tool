// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // URL全体ではなく、リポジトリ名のみを / で囲って指定します
  base: '/island-layout-tool/', 
})