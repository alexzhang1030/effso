import { writeFile } from 'node:fs/promises'
import merge from 'putil-merge'
import { printErr, readAndParseTS, readGuard, targetRootPkgJSON } from '../utils'
import type { PackageJSON } from '..'

async function single(path: string) {
  const content = await readAndParseTS(path)
  const pkgJson = await readGuard(targetRootPkgJSON(), 'package.json')
  const code = `${content};\n\nreturn main(${pkgJson});`
  // eslint-disable-next-line no-new-func
  return new Function(code)()
}

export async function resolvePkg(files: string[], parentPath: string) {
  const promises = []
  for (const item of files) {
    promises.push(new Promise<PackageJSON>((resolve) => {
      single(`${parentPath}/${item}`).then((result) => {
        resolve(result)
      }).catch((err) => {
        printErr((err as Error).message)
      })
    }))
  }
  const chunks = await Promise.all(promises)
  const finalPkg = merge.all([...chunks])
  await writeFile(targetRootPkgJSON(), JSON.stringify(finalPkg, null, 2))
}
