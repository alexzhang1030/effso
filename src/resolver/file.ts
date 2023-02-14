import { readFileSync, writeFileSync } from 'fs'
import { ensureDirSync } from 'fs-extra'
import { TARGET_PATH, readAndParseTS } from '../utils'

const single = async (path: string) => {
  const content = await readAndParseTS(path)
  const code = `${content};\n\n
    main("${TARGET_PATH}", {
      read,
      write
    });
  `

  const readFn = (path: string) => {
    return readFileSync(path, 'utf-8')
  }

  const writeFn = (path: string, content: string) => {
    ensureDirSync(path)
    writeFileSync(path, content, 'utf-8')
  }

  // eslint-disable-next-line no-new-func
  new Function('read', 'write', code)(readFn, writeFn)
}

export const resolveFile = async (files: string[], parentPath: string) => {
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
