import { readFile } from 'fs/promises'
import { exists } from 'fs-extra'

export const readGuard = async (path: string, name: string) => {
  const exist = await exists(path)
  if (exist)
    return await readFile(path, 'utf-8')
  else
    throw new Error(`[Effso] Error: Read ${name} failed`)
}
