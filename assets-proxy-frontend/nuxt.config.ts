import { resolve } from 'path'

export default defineNuxtConfig({
  devtools: { enabled: true },
  alias: {
    '@': resolve(__dirname, '/')
  },
  css: [
    '~/assets/styles/main.scss'
  ],
  vite: {
    server: {
      watch: {
        usePolling: true
      }
    }
  }
})
