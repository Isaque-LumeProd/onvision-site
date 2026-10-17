import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getHtmlEntries() {
  const entries = { main: resolve(__dirname, 'index.html') };
  const items = fs.readdirSync(__dirname, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory() && !['node_modules', 'dist', 'public', '.git', 'src', 'scripts'].includes(item.name)) {
      const htmlPath = resolve(__dirname, item.name, 'index.html');
      if (fs.existsSync(htmlPath)) {
        entries[item.name] = htmlPath;
      }
    }
  }
  return entries;
}

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: getHtmlEntries(),
    },
  },
});

