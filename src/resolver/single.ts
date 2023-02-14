import { confirm, multiselect } from '@clack/prompts'
import fg from 'fast-glob'
import { copy } from 'fs-extra'
import { GLOB_PATTERNS, joinTemplate, resolveSpecial, specialKeys, specialMapping, withTarget } from '../utils/path'
import { safetyRun } from '../utils/run'

export const resolveSingle = async (parentPath: string) => {
  const singleFiles = resolveSpecial(await fg(GLOB_PATTERNS.single, {
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
