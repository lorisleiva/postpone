import path from 'path'
import { defineConfig  } from 'vite';
import * as pkg from './package.json';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Postpone',
      fileName: (format) => `postpone.${format}.js`,
    },
    rollupOptions: {
      external: [
        ...Object.keys(pkg.peerDependencies || {}),
      ],
    },
  }
});
