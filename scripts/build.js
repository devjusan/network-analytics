import { build } from 'esbuild'
import pkg from 'npm-dts'

new pkg.Generator({
  entry: 'src/index.ts',
  output: 'dist/index.d.ts'
}).generate()

build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.esm.js',
  format: 'cjs',
  platform: 'browser',
  minify: true,
  bundle: true,
  treeShaking: true,
  tsconfig: './tsconfig.json'
})
