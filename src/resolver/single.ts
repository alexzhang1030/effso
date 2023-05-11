import { copy } from 'fs-extra'
import { joinTemplate, resolveSpecial, safetyRun, specialKeys, specialMapping, withTarget } from '../utils'

export async function resolveSingle(files: string[], parentPath: string) {
  await safetyRun(async () => await Promise.all(resolveSpecial(files, false).map((item) => {
    return copy(joinTemplate(`${parentPath}/${item}`), withTarget(
      specialKeys.includes(item) ? specialMapping[item as keyof typeof specialMapping] : item,
    ))
  })))
}
