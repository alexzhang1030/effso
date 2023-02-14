function main(path: string, helpers: {
  read: (path: string) => string
  write: (path: string, content: string) => void
}) {
  const target = `${path}/.github/renovate.json`
  try {
    helpers.read(target)
  }
  catch (error) {
    helpers.write(target, JSON.stringify({
      extends: ['config:base'],
    }, null, 2))
  }
}
