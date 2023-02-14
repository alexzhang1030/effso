import hot from 'home-or-tmp'
import { basename, resolve } from 'pathe'
import findRoot from 'find-root'

export const TARGET_PATH = process.cwd()
export const homeOrTemp: string = hot
export const DEFAULT_TEMPLATE_PATH = resolve(homeOrTemp, './.effso')

export const specialMapping = {
  _gitignore: '.gitignore',
  _foo: '.bar',
}

export const specialKeys = Object.keys(specialMapping)

export const resolveSpecial = (paths: string[], toReal = true) => {
  const _currentMap: Record<string, string> = toReal
    ? specialMapping
    : Object.entries(specialMapping).reduce((acc, [k, v]) => {
      acc[v] = k
      return acc
    }, {} as Record<string, string>)
  return paths.map(item => _currentMap[item] || item)
}
export const joinTemplate = (sub: string) => resolve(DEFAULT_TEMPLATE_PATH, sub)
export const withTarget = (path: string) => resolve(TARGET_PATH, path)
export const splitPaths = (files: string[]) => {
  const pkgPaths: string[] = []
  const singles: string[] = []
  const filePaths: string[] = []
  for (const item of files) {
    if (item.endsWith('.pkg.ts'))
      pkgPaths.push(item)
    else if (item.endsWith('.file.ts'))
      filePaths.push(item)
    else
      singles.push(item)
  }
  return {
    pkgPaths,
    singles,
    filePaths,
  }
}

export const targetRoot = () => basename(findRoot(TARGET_PATH))
export const targetRootPkgJSON = () => resolve(targetRoot(), 'package.json')
