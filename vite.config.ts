import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** GitHub Pages kökü: /demo-qr/ (CI'da GITHUB_PAGES=true) */
const repo = 'demo-qr';

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? `/${repo}/` : '/',
  plugins: [react(), tailwindcss()],
});
