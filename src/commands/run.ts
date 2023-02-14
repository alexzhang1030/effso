import { intro, outro } from '@clack/prompts'
import { resolve } from '../resolver'
import { DEFAULT_TEMPLATE_PATH } from '../utils/path'

export const run = async () => {
  intro('🚀 Effso')
  await resolve(DEFAULT_TEMPLATE_PATH)
  outro('👋 Effso end...')
}
