import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve('index.html'),
        andradina: resolve('andradina/index.html'),
        castilho: resolve('castilho/index.html'),
        'ilha-solteira': resolve('ilha-solteira/index.html'),
        'pereira-barreto': resolve('pereira-barreto/index.html'),
        mirandopolis: resolve('mirandopolis/index.html'),
        aracatuba: resolve('aracatuba/index.html'),
        brasilandia: resolve('brasilandia/index.html'),
        selviria: resolve('selviria/index.html'),
        'aparecida-do-taboado': resolve('aparecida-do-taboado/index.html'),
        inocencia: resolve('inocencia/index.html'),
        'agua-clara': resolve('agua-clara/index.html'),
        'santa-rita-do-pardo': resolve('santa-rita-do-pardo/index.html'),
        paranaiba: resolve('paranaiba/index.html'),
        bataguassu: resolve('bataguassu/index.html'),
        'presidente-epitacio': resolve('presidente-epitacio/index.html'),
        'ribas-do-rio-pardo': resolve('ribas-do-rio-pardo/index.html'),
        cassilandia: resolve('cassilandia/index.html'),
        'chapadao-do-sul': resolve('chapadao-do-sul/index.html'),
      },
    },
  },
});
