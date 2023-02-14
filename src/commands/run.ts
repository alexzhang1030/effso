import { intro, outro } from '@clack/prompts'
import { exists } from 'fs-extra'
import chalk from 'chalk'
import consola from 'consola'
import { resolve } from '../resolver'
import { DEFAULT_TEMPLATE_PATH } from '../utils/path'

export const run = async () => {
  const isExist = await exists(DEFAULT_TEMPLATE_PATH)
  if (!isExist) {
    consola.error(`Can't find any template in ${chalk.blueBright(DEFAULT_TEMPLATE_PATH)}, try run ${chalk.cyan('effso setup')}`)
    return
  }
  intro('🚀 Effso')
  await resolve(DEFAULT_TEMPLATE_PATH)
  outro('👋 Effso end...')
}
