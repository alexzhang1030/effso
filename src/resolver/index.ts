import fg from 'fast-glob'
import { select } from '@clack/prompts'
import { joinTemplate } from '../utils/path'
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

export const resolve = async (path: string) => {
  const rootDirs = await fg('*', {
    cwd: path,
    onlyDirectories: true,
  })
  const root = await resolveRootOptions(rootDirs) as string
  await resolveSingle(root)
}
