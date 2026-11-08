import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/simulasi.tka/',
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Tell Vue to treat math-field as a custom element
          isCustomElement: (tag) => tag === 'math-field'
        }
      }
    })
  ],
  server: {
    port: 5173,
    host: true
  }
})
