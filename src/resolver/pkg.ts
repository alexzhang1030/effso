import { writeFile } from 'fs/promises'
import merge from 'putil-merge'
import { printErr, readAndParseTS, readGuard, targetRootPkgJSON } from '../utils'
import type { PackageJSON } from '..'

const single = async (path: string) => {
  const content = await readAndParseTS(path)
  try {
    const pkgJson = await readGuard(targetRootPkgJSON(), 'package.json')
    const code = `${content};\n\nreturn main(${pkgJson});`
    // eslint-disable-next-line no-new-func
    return new Function(code)()
  }
  catch (error) {
    printErr((error as Error).message)
  }
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
  await writeFile(targetRootPkgJSON(), JSON.stringify(finalPkg, null, 2))
}
