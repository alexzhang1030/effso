import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  rollup: {
    inlineDependencies: true,
  },
  entries: ['./src/cli', './src/index'],
  declaration: true,
})
