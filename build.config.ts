import { resolve } from 'node:path'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  rollup: {
    inlineDependencies: true,
  },
  entries: ['./src/cli', './src/index'],
  externals: ['esbuild', 'consola', 'fs-extra', 'cac', 'fast-glob', 'degit'],
  declaration: true,
  alias: {
    '@': resolve(__dirname, 'src'),
    '~': __dirname,
  },
})
