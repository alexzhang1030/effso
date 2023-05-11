import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { ensureDirSync } from 'fs-extra'
import { TARGET_PATH, readAndParseTS } from '../utils'

async function single(path: string) {
  const content = await readAndParseTS(path)
  const code = `${content};\n\n
    main("${TARGET_PATH}", {
      read,
      write
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

  // eslint-disable-next-line no-new-func
  new Function('read', 'write', code)(readFn, writeFn)
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
