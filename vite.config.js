import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        andradina: resolve(__dirname, 'andradina/index.html'),
        castilho: resolve(__dirname, 'castilho/index.html'),
        'ilha-solteira': resolve(__dirname, 'ilha-solteira/index.html'),
        'pereira-barreto': resolve(__dirname, 'pereira-barreto/index.html'),
        mirandopolis: resolve(__dirname, 'mirandopolis/index.html'),
        aracatuba: resolve(__dirname, 'aracatuba/index.html'),
        brasilandia: resolve(__dirname, 'brasilandia/index.html'),
        selviria: resolve(__dirname, 'selviria/index.html'),
        'aparecida-do-taboado': resolve(__dirname, 'aparecida-do-taboado/index.html'),
        inocencia: resolve(__dirname, 'inocencia/index.html'),
        'agua-clara': resolve(__dirname, 'agua-clara/index.html'),
        'santa-rita-do-pardo': resolve(__dirname, 'santa-rita-do-pardo/index.html'),
        paranaiba: resolve(__dirname, 'paranaiba/index.html'),
        bataguassu: resolve(__dirname, 'bataguassu/index.html'),
        'presidente-epitacio': resolve(__dirname, 'presidente-epitacio/index.html'),
        'ribas-do-rio-pardo': resolve(__dirname, 'ribas-do-rio-pardo/index.html'),
        cassilandia: resolve(__dirname, 'cassilandia/index.html'),
        'chapadao-do-sul': resolve(__dirname, 'chapadao-do-sul/index.html'),
      },
    },
  },
});
