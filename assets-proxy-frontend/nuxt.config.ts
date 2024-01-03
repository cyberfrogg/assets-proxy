// @ts-ignore
import { resolve } from 'path'

// @ts-ignore
export default defineNuxtConfig({
  devtools: { enabled: true },
  alias: {
    // @ts-ignore
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
  },
  head: {
    title: 'Assets Proxy',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ]
  },
})
