import { readFile } from 'fs/promises'
import { confirm } from '@clack/prompts'
import { transform } from 'esbuild'
import consola from 'consola'
import { joinTemplate } from './path'

export * from './file'
export * from './path'
export * from './run'

export const makeSure = async (cb: () => Promise<void>, message: string) => {
  const sure = await confirm({
    message,
  })
  if (sure)
    await cb()
}

export const readAndParseTS = async (path: string) => {
  const fileContent = await readFile(joinTemplate(path), {
    encoding: 'utf-8',
  })
  const content = await transform(fileContent, {
    loader: 'ts',
  })
  return content.code
}

export const printErr = (message: string) => {
  consola.error(message)
}
