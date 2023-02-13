import cac from 'cac'
import { version } from '../../package.json'
import { safetyRun } from '../utils/run'
import { run } from './effso'
import { setup } from './setup'

export const setupCLI = async () => {
  const cli = cac()

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
