import cac from 'cac'
import { run } from './run'
import { setup } from './setup'
import { injectHook } from './hook'
import { safetyRun } from '@/utils'
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

  cli.help()
  cli.version(version)
  cli.parse()
}
