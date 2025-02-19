import { build } from 'esbuild'
import { sync } from 'glob'

const entryPoints = sync('./src/**/*.ts')

build({
  entryPoints,
  outbase: './src',
  outdir: 'dist/',
  format: 'cjs',
  platform: 'browser',
  minify: true,
  bundle: true,
  tsconfig: './tsconfig.json'
})
