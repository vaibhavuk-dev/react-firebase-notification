import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    minify: false,
    external: ['react', 'react-dom', 'firebase', 'firebase/app', 'firebase/messaging'],
});
