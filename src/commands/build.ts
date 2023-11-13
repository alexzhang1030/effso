import { resolve } from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'
import { destr } from 'destr'
import degit from 'degit'
import { targetRoot } from '@/utils'

interface Config {
  extends?: string[]
  resolved?: boolean
}

// build commands means to combine multiple templates into one template
// NOTE: currently only fully rewrite whole project, the backend is `degit`
export async function build() {
  const jsonPath = resolve(targetRoot(), '.effso/config.json')
  const json = destr<Config>(readFileSync(jsonPath, 'utf-8'))
  if (json.extends && !json.resolved) {
    for (const extend of json.extends) {
      await degit(extend, {
        cache: false,
        force: true,
        verbose: true,
        mode: 'tar',
      }).clone(targetRoot())
    }
  }
  json.resolved = true
  writeFileSync(jsonPath, JSON.stringify(json, null, 2))
}
