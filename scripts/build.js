import { build } from 'esbuild'

build({
  entryPoints: ['src/index.ts'],
  outbase: './src',
  outdir: 'dist/',
  format: 'esm',
  platform: 'browser',
  minify: true,
  bundle: true,
  tsconfig: './tsconfig.json'
})
