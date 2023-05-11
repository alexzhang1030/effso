import { readFile } from 'node:fs/promises'
import { confirm } from '@clack/prompts'
import { transform } from 'esbuild'
import consola from 'consola'
import { joinTemplate } from './path'

export * from './file'
export * from './path'
export * from './run'

export async function makeSure(cb: () => Promise<void>, message: string) {
  const sure = await confirm({
    message,
  })
  if (sure)
    await cb()
}

export async function readAndParseTS(path: string) {
  const fileContent = await readFile(joinTemplate(path), {
    encoding: 'utf-8',
  })
  const content = await transform(fileContent, {
    loader: 'ts',
  })
  return content.code
}

export function printErr(message: string) {
  consola.error(message)
}
