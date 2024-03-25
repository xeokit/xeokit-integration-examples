/// <reference types="vitest" />

import Vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

const resolve = (p: string) => path.resolve(__dirname, p);

export default defineConfig({
  server: {
    host: true,
    port: 8082,

    fs: {
      allow: ['../..'],
    },

    watch: {
      usePolling: true,
    },
  },

  base: '/',
  clearScreen: true,
  assetsInclude: /\.(pdf|jpg|png|svg)$/,

  resolve: {
    alias: {
      '@/': `${resolve('./src')}/`,
    },
  },

  publicDir: resolve('./src/public'),

  plugins: [
    Vue(),

    process.env.VITE_DISABLE_VUE_TSC
      ? null
      : checker({
        vueTsc: true,
      }),
  ],

  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
