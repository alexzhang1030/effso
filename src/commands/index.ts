import cac from 'cac'
import { intro } from '@clack/prompts'
import { run } from './run'
import { setup } from './setup'
import { injectHook } from './hook'
import { genShellCheckScript } from './env'
import { build } from './build'
import { makeSure, safetyRun } from '@/utils'
import { version } from '~/package.json'

export async function setupCLI() {
  const cli = cac('effso')

  cli.command('').action(() => {
    cli.outputHelp()
  })

  cli.command('run', 'Run effso').action(async () => {
    await safetyRun(run)
  })

  cli.command('setup', 'Setup effso initial template').action(async () => {
    await safetyRun(setup)
  })

  cli.command('shell', 'Inject hooks to zsh shell').action(async () => {
    await safetyRun(injectHook)
  })

  cli.command('env', 'Effso env things on zsh').action(() => {
    // eslint-disable-next-line no-console
    console.log(genShellCheckScript())
  })

  cli.command('build', 'Build by config').action(async () => {
    intro('[EFFSO] Detect config file...')
    await makeSure(async () => {
      await safetyRun(build)
    }, 'Are you sure to run build? This will overwrite your project.')
  })

  cli.help()
  cli.version(version)
  cli.parse()
}
