export default defineNuxtConfig({
  devtools: { enabled: true },
  srcDir: './src',

  devServer: {
    port: 8083,
  },

  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },

  typescript: {
    tsConfig: {
      extends: 'tsconfig/nuxt.json',
    },

    typeCheck: true,
  },

  css: [
    'tippy.js/dist/tippy.css',
    'xeokit-bim-viewer/dist/xeokit-bim-viewer.css',
    '~/assets/style.css',
  ],
});
