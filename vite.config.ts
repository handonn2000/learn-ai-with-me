/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: '/learn-ai-with-me/',
  plugins: [
    { enforce: 'pre', ...mdx({ providerImportSource: '@mdx-js/react' }) },
    react({ include: /\.(mdx|ts|tsx)$/ }),
    tailwindcss(),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
})
