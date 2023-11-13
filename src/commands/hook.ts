import { spawn, spawnSync } from 'node:child_process'
import { createWriteStream, existsSync } from 'node:fs'
import consola from 'consola'
import { homeOrTemp, printErr } from '@/utils'

const HookContent = [
  '# === effso start ===',
  `eval "$(effso check)"`,
  '# === effso end ===',
]

const zshrc = `${homeOrTemp}/.zshrc`

// macOS/Linux only, requires `zsh` and `grep` command
// inject chpwd hook to zsh shell
export function injectHook() {
  return new Promise<void>((resolve, reject) => {
    if (!existsSync(zshrc))
      reject(new Error(`File ${zshrc} does not exist`))
    const find = spawn('grep', [HookContent[0], zshrc])
    let exists = false
    find.stdout.on('data', () => {
      exists = true
    })
    find.stdout.on('end', () => {
      if (exists) {
        consola.info('Hook already exists, skip...')
        return resolve()
      }
      writeHook()
      resolve()
    })
    find.stderr.on('data', (data) => {
      reject(new Error(`${data}`))
    })
  })
}

function writeHook() {
  const stream = createWriteStream(zshrc, { flags: 'a' })
  const write = spawn('echo', [HookContent.join('\n')])
  write.stdout.pipe(stream)
  write.on('close', () => {
    spawnSync('source', [zshrc])
    consola.success('Hook injected')
  })
  write.stderr.on('data', (data) => {
    printErr(`${data}`)
  })
}
