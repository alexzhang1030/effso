import { fileURLToPath } from 'node:url'
import { resolve } from 'pathe'
import { copy } from 'fs-extra'
import consola from 'consola'
import { packageDirectory } from 'pkg-dir'
import { DEFAULT_TEMPLATE_PATH } from '../utils/path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export const setup = async () => {
  const fromPath = await packageDirectory() ?? __dirname
  const targetPath = `${DEFAULT_TEMPLATE_PATH}/example`
  copy(resolve(fromPath, './template/example'), targetPath)
  consola.success(`Effso template copied to ${targetPath}`)
}
