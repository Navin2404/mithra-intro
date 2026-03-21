import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'

export default defineConfig({
  plugins: [glsl()],

  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap:  ['gsap'],
          lenis: ['lenis'],
        },
      },
    },
  },

  server: {
    port: 3000,
    open: true,
  },
})