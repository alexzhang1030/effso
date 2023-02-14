export type PackageJSON = Partial<{
  // list all the package.json fields here
  name: string
  version: string
  description: string
  main: string
  scripts: Record<string, string>
  keywords: string[]
  files: string[]
  bin: Record<string, string>
  devDependencies: Record<string, string>
  dependencies: Record<string, string>
  [key: string]: any
}>

export type DefaultConfig = Partial<{
  default: string[]
}>
