// @ts-expect-error home-or-tmp is not typed
import hot from 'home-or-tmp'
import { resolve } from 'pathe'

export const homeOrTemp: string = hot
export const DEFAULT_TEMPLATE_PATH = resolve(homeOrTemp, './.effso')
export const GLOB_PATTERNS = {
  pkg: ['*.pkg.ts', '!main.ts'],
  file: ['*.file.ts', '!main.ts'],
  single: ['*', '!*.pkg.ts', '!*.file.ts', '!main.ts'],
}

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
export const globNot = (pattern: string[]) => pattern.map(p => `!${p}`)
