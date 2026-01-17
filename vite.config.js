import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ▼ ここを追加（自分のリポジトリ名に変えてください！）
  base: 'https://github.com/nakasho-hub/island-layout-tool/', 
})