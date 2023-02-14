import { resolve } from '../resolver'
import { DEFAULT_TEMPLATE_PATH } from '../utils/path'

export const run = async () => {
  console.log('init')
  await resolve(DEFAULT_TEMPLATE_PATH)
}
