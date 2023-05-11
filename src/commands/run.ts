import { intro, outro } from '@clack/prompts'
import { exists } from 'fs-extra'
import consola from 'consola'
import { blueBright, cyan } from 'colorette'
import { resolve } from '../resolver'
import { DEFAULT_TEMPLATE_PATH } from '../utils/path'

export async function run() {
  const isExist = await exists(DEFAULT_TEMPLATE_PATH)
  if (!isExist) {
    consola.error(`Can't find any template in ${blueBright(DEFAULT_TEMPLATE_PATH)}, try run ${cyan('effso setup')}`)
    return
  }
  intro('🚀 Effso')
  await resolve(DEFAULT_TEMPLATE_PATH)
  outro('👋 Effso end...')
}
