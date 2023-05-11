import cac from 'cac'
import { version } from '../../package.json'
import { safetyRun } from '../utils'
import { run } from './run'
import { setup } from './setup'

export async function setupCLI() {
  const cli = cac('effso')

  cli.command('run', 'Run effso').action(async () => {
    await safetyRun(run)
  })

  cli.command('setup', 'Setup effso initial template').action(async () => {
    await safetyRun(setup)
  })

  cli.help()
  cli.version(version)
  cli.parse()
}
