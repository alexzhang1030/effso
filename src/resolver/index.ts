import fg from 'fast-glob'

export const resolve = async (path: string) => {
  const pattern = await fg('*', {
    cwd: path,
    onlyDirectories: true,
  })
  console.log({
    pattern,
  })
}
