import { fileURLToPath } from 'node:url'
import { resolve } from 'pathe'
import { copy } from 'fs-extra'
// @ts-expect-error home-or-tmp is not typed
import homeOrTemp from 'home-or-tmp'
import consola from 'consola'
import { packageDirectory } from 'pkg-dir'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export const setup = async () => {
  const targetPath = resolve(homeOrTemp, './.effso')
  const fromPath = await packageDirectory() ?? __dirname
  copy(resolve(fromPath, './template/setup'), targetPath)
  consola.success(`Effso template copied to ${targetPath}`)
}
