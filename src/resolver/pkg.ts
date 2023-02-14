import { readFile } from 'fs/promises'
import fg from 'fast-glob'
import * as esbuild from 'esbuild'
import { multiselect } from '@clack/prompts'
import { GLOB_PATTERNS, joinTemplate, targetRootPkgJSON } from '../utils/path'
import { readGuard } from '../utils/file'

const single = async (path: string) => {
  const fileContent = await readFile(joinTemplate(path), {
    encoding: 'utf-8',
  })
  const content = await esbuild.transform(fileContent, {
    loader: 'ts',
  })
  const pkgJson = await readGuard(targetRootPkgJSON(), 'package.json')
  const code = `${content.code};\n\nreturn main(${pkgJson});`
  // eslint-disable-next-line no-new-func
  return new Function(code)()
}

export const resolvePkg = async (parentPath: string) => {
  const pkgFiles = await fg(GLOB_PATTERNS.pkg, {
    onlyFiles: true,
    cwd: parentPath,
  })
  const selected = await multiselect({
    message: '[Pkg file]: Pick you want to operate current root package.json',
    options: pkgFiles.map(item => ({
      value: item,
    })),
  }) as string[]
  const chunks = []
  for (const item of selected)
    chunks.push(await single(`${parentPath}/${item}`))
}
