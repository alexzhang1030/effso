import { readFile } from 'node:fs/promises'
import fg from 'fast-glob'
import { isCancel, multiselect, select } from '@clack/prompts'
import { exists } from 'fs-extra'
import { joinTemplate, makeSure, printErr, resolveSpecial, splitPaths } from '../utils'
import type { DefaultConfig } from '..'
import { resolvePkg } from './pkg'
import { resolveSingle } from './single'
import { resolveFile } from './file'

async function resolveRootOptions(rootDirs: string[] = []) {
  return await select({
    message: 'Pick a type',
    options: rootDirs.map(item => ({
      value: joinTemplate(item),
      label: item,
    })),
  })
}

async function readDefaultConfig(parentPath: string) {
  const mainJson = `${parentPath}/main.json`
  let defaultConfig: DefaultConfig = {
    default: [],
  }
  if (await exists(mainJson))
    defaultConfig = JSON.parse(await readFile(`${parentPath}/main.json`, 'utf-8'))

  return defaultConfig
}

async function resolveOptions(parentPath: string) {
  // TODO: default config
  const defaultConfig = await readDefaultConfig(parentPath)
  let files = await fg(['*', '!main.json'], {
    onlyFiles: true,
    dot: true,
    cwd: parentPath,
  })

  files = resolveSpecial(files)

  const selected = await multiselect({
    message: 'Pick operations',
    options: files.map(item => ({
      value: item,
      label: item,
    })),
    initialValue: defaultConfig.default,
  }) as string[]

  if (isCancel(selected))
    return

  const { filePaths, pkgPaths, singles } = splitPaths(selected)
  makeSure(async () => {
    if (singles.length)
      await resolveSingle(singles, parentPath)
    if (pkgPaths.length)
      await resolvePkg(pkgPaths, parentPath)
    if (filePaths.length)
      await resolveFile(filePaths, parentPath)
  }, 'Are you sure?')
}

export async function resolve(path: string) {
  try {
    const rootDirs = await fg('*', {
      cwd: path,
      onlyDirectories: true,
    })
    const root = await resolveRootOptions(rootDirs) as string
    if (isCancel(root))
      return

    await resolveOptions(root)
  }
  catch (error) {
    printErr((error as Error).message)
  }
}
