import { readFile, writeFile } from 'fs/promises'
import * as esbuild from 'esbuild'
import merge from 'putil-merge'
import { joinTemplate, readGuard, targetRootPkgJSON } from '../utils'
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

export const resolvePkg = async (files: string[], parentPath: string) => {
  const promises = []
  for (const item of files) {
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
