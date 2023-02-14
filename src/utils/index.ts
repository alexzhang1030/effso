import { confirm } from '@clack/prompts'

export * from './file'
export * from './path'
export * from './run'

export const makeSure = async (cb: () => Promise<void>, message: string) => {
  const sure = await confirm({
    message,
  })
  if (sure)
    cb()
}
