// @ts-expect-error home-or-tmp is not typed
import hot from 'home-or-tmp'
import { basename, resolve } from 'pathe'
// @ts-expect-error find-root is not typed
import findRoot from 'find-root'

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
export const withTarget = (path: string) => resolve(process.cwd(), path)
export const splitPaths = (files: string[]) => {
  // 根据不同的后缀，拆分为不同的数组, 如果以 .pkg.ts 为后缀，拆分为 pkg.ts, 如果以 .file.ts 为后缀，拆分为 ts
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

export const targetRoot = () => basename(findRoot(process.cwd()))
export const targetRootPkgJSON = () => resolve(process.cwd(), 'package.json')
