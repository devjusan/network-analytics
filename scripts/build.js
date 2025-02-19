import { build } from 'esbuild'

build({
  entryPoints: ['src/index.ts'],
  outbase: './src',
  outdir: 'dist/',
  format: 'cjs',
  platform: 'browser',
  minify: true,
  bundle: true,
  tsconfig: './tsconfig.json'
})
