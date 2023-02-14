import fg from 'fast-glob'
import { confirm, multiselect, select } from '@clack/prompts'
import { copy } from 'fs-extra'
import { GLOB_PATTERNS, joinTemplate, resolveSpecial, specialKeys, specialMapping, withTarget } from '../utils/path'
import { safetyRun } from '../utils/run'

const resolveRootOptions = async (rootDirs: string[] = []) => {
  return await select({
    message: 'Pick a type',
    options: rootDirs.map(item => ({
      value: joinTemplate(item),
      label: item,
    })),
  })
}

const resolveSingle = async (parentPath: string) => {
  const singleFiles = resolveSpecial(await fg([...GLOB_PATTERNS.single], {
    onlyFiles: true,
    cwd: parentPath,
    dot: true,
  }))
  const selected = await multiselect({
    message: '[Single file]: Pick you want to overrides',
    options: singleFiles.map(item => ({
      value: item,
      label: item,
    })),
  }) as string[]
  const sure = await confirm({
    message: 'Are you sure you want to overrides these files?',
  })
  if (!sure)
    return
  safetyRun(async () => await Promise.all(resolveSpecial(selected, false).map((item) => {
    return copy(joinTemplate(`${parentPath}/${item}`), withTarget(
      specialKeys.includes(item) ? specialMapping[item as keyof typeof specialMapping] : item,
    ))
  })))
}

export const resolve = async (path: string) => {
  const rootDirs = await fg('*', {
    cwd: path,
    onlyDirectories: true,
  })
  const root = await resolveRootOptions(rootDirs) as string
  await resolveSingle(root)
}
