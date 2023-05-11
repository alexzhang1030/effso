import { readFile } from 'node:fs/promises'
import { exists } from 'fs-extra'

export async function readGuard(path: string, name: string) {
  const exist = await exists(path)
  if (exist)
    return await readFile(path, 'utf-8')
  else
    throw new Error(`Read ${name} failed, does it exist?`)
}
