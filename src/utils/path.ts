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

export const resolveSpecial = (paths: string[]) => {
  const results = []
  for (const item of paths) {
    if (item === '_gitignore')
      results.push('.gitignore')
    else
      results.push(item)
  }
  return results
}
export const joinTemplate = (sub: string) => resolve(DEFAULT_TEMPLATE_PATH, sub)
export const withTarget = (path: string) => resolve(process.cwd(), path)
export const globNot = (pattern: string[]) => pattern.map(p => `!${p}`)