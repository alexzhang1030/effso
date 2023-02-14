import fg from 'fast-glob'
import { multiselect, select } from '@clack/prompts'
import { joinTemplate, makeSure, resolveSpecial, splitPaths } from '../utils'
import { resolvePkg } from './pkg'
import { resolveSingle } from './single'

const resolveRootOptions = async (rootDirs: string[] = []) => {
  return await select({
    message: 'Pick a type',
    options: rootDirs.map(item => ({
      value: joinTemplate(item),
      label: item,
    })),
  })
}

const resolveOptions = async (parentPath: string) => {
  let files = await fg(['*', '!main.ts'], {
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
  }) as string[]

  const { filePaths, pkgPaths, singles } = splitPaths(selected)
  makeSure(async () => {
    if (singles.length)
      await resolveSingle(singles, parentPath)
    if (pkgPaths.length)
      await resolvePkg(pkgPaths, parentPath)
  }, 'Are you sure?')
}

export const resolve = async (path: string) => {
  const rootDirs = await fg('*', {
    cwd: path,
    onlyDirectories: true,
  })
  const root = await resolveRootOptions(rootDirs) as string
  await resolveOptions(root)
}
