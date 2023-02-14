import { readFile, writeFile } from 'fs/promises'
import fg from 'fast-glob'
import * as esbuild from 'esbuild'
import { multiselect } from '@clack/prompts'
import merge from 'putil-merge'
import { GLOB_PATTERNS, joinTemplate, readGuard, targetRootPkgJSON } from '../utils'
import type { PackageJSON } from '..'

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
  const promises = []
  for (const item of selected) {
    promises.push(new Promise<PackageJSON>((resolve, reject) => {
      single(`${parentPath}/${item}`).then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      })
    }))
  }
  const chunks = await Promise.all(promises)
  const finalPkg = merge.all([...chunks])
  writeFile(targetRootPkgJSON(), JSON.stringify(finalPkg, null, 2))
}
