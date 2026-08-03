import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue(), viteSingleFile()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // mermaid 内部有动态 import，强制全部合并进单 chunk，保证单文件可内联
        inlineDynamicImports: true,
      },
    },
  },
})
