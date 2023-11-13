import { resolve } from 'node:path'
import { readFileSync, rmdirSync } from 'node:fs'
import { destr } from 'destr'
import degit from 'degit'
import { outro } from '@clack/prompts'
import { targetRoot } from '@/utils'

interface Config {
  extends?: string[]
}

// build commands means to combine multiple templates into one template
// NOTE: currently only fully rewrite whole project, the backend is `degit`
export async function build() {
  const jsonPath = resolve(targetRoot(), '.effso/config.json')
  const json = destr<Config>(readFileSync(jsonPath, 'utf-8'))
  if (json.extends) {
    for (const extend of json.extends) {
      await degit(extend, {
        cache: false,
        force: true,
        verbose: true,
        mode: 'tar',
      }).clone(targetRoot())
    }
  }
  rmdirSync(resolve(targetRoot(), '.effso'))
  outro('Done!')
}
