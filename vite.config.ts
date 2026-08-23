import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  // Project page của GitHub Pages nằm ở subpath /<repo>/ — mọi asset phải mang tiền tố này.
  // Đổi giá trị nếu đổi tên repo hoặc dùng domain riêng (lúc đó để '/').
  base: '/learn-ai-with-me/',
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
