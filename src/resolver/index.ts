import fg from 'fast-glob'
import { multiselect, select } from '@clack/prompts'
import { joinTemplate, splitPaths } from '../utils/path'
import { makeSure } from '../utils'
import { resolveSingle } from './single'
import { resolvePkg } from './pkg'

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
  const files = await fg(['*', '!main.ts'], {
    onlyFiles: true,
    dot: true,
    cwd: parentPath,
  })

  const selected = await multiselect({
    message: 'Pick operations',
    options: files.map(item => ({
      value: item,
      label: item,
    })),
  }) as string[]

  const { filePaths, pkgPaths, singles } = splitPaths(selected)
  makeSure(async () => {
    await resolveSingle(singles, parentPath)
    await resolvePkg(pkgPaths, parentPath)
  },
  'Are you sure?')
}

export const resolve = async (path: string) => {
  const rootDirs = await fg('*', {
    cwd: path,
    onlyDirectories: true,
  })
  const root = await resolveRootOptions(rootDirs) as string
  await resolveOptions(root)
}
