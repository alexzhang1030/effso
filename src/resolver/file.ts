import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { ensureDirSync } from 'fs-extra'
import mergeUtil from 'putil-merge'
import { TARGET_PATH, readAndParseTS } from '@/utils'

async function single(path: string) {
  const content = await readAndParseTS(path)
  const code = `${content};\n\n
    main("${TARGET_PATH}", {
      read,
      write,
      merge
    });
  `

  const ifExist = (path: string) => {
    return existsSync(path)
  }

  const readFn = (path: string) => {
    return ifExist(path)
      ? readFileSync(path, 'utf-8')
      : null
  }

  const writeFn = (path: string, content: string) => {
    ensureDirSync(path.split('/').slice(0, -1).join('/') ?? '')
    writeFileSync(path, content, 'utf-8')
  }

  const mergeFn = (target: object, source: object) => {
    return mergeUtil(target, source, {
      deep: true,
    })
  }

  // eslint-disable-next-line no-new-func
  new Function('read', 'write', 'merge', code)(readFn, writeFn, mergeFn)
}

export async function resolveFile(files: string[], parentPath: string) {
  const promises = []
  for (const item of files) {
    promises.push(new Promise<void>((resolve, reject) => {
      single(`${parentPath}/${item}`).then(() => {
        resolve()
      }).catch((err) => {
        reject(err)
      })
    }))
  }
  await Promise.all(promises)
}
