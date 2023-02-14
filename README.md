# Effso

> **Warning**
> Notice that Effso is still in the early stage of development, and the API is not stable. Use it at your own risk.

## Basic conception

What problems does Effso solve?

Just imagine a scene:

Every time when you init a blank project, you need to copy the same files to configure tools, you need do the same thing to every project, such as add a `.edtorconfig` file.

A starter-template? Yes, it's a very good idea, but also have some problems.

1. A starter-template cannot split the common files, such as `.editorconfig` and `.gitignore`, from the project files.
2. A starter-template is not general enough. It's hard to maintain multiple starter-templates for multiple topics(such as `TypeScript` or `Nuxt`).
3. It's a hard thing that you need to maintain a starter-template for a long time.(For example, you want to change the `.editorconfig` file, you need to update all the starter-templates.)
4. ...

So why not make it more atomic?

Effso based on the concept of atomic, it's a tool to help you operate files and directories in a more efficient way.

Effso reads user pre-defined rules, and operates files by following some ways.

## Installation

```bash
pnpm i -g effso
```

## Setup

```bash
effso setup
```

will generate a `.effso/example` directory in your home directory.

It generates some simple examples:

- `main.json`
- `.editorconfig`
- `.gitignore`
- `eslint.pkg.ts`
- `renovate.file.ts`

## Usage

```bash
# Run in your project directory
effso run
```

Will shows a selector, you can choose the rules you want to run.

It will read `~/.effso/*` to generate rules. One second level directory will become one option.

When you choose a rule, it will read the files in the directory, and operate current workspace files by pre-defined rules.

### Rules

#### `main.json`

Configure current root option default selected rules.

Currently only support `JSON`. If `main.json` is not provided, will have no default selected rules.

```json
{
  "default": [
    ".gitignore",
    ".editorconfig",
    "eslint.pkg.ts"
  ]
}
```

#### Single file

Every single file selected will overrides current workspace file.

#### *.pkg.ts

Will execute this rule by passing current `package.json` if it exists.

Notice this file can only have one function, it's name must be `main`, and can only accept one argument.

```ts
function main(pkg: Record<string, any>) {
  // do something...
}
```

#### *.file.ts

Will execute this rule by passing current workspace path.

The same as `*.pkg.ts`, this file can only have one function, it's name must be `main`, and can only accept two arguments.

```ts
function main(path: string, helpers: {
  read: (path: string) => string
  write: (path: string, content: string) => void
}) {
  // to something
}
```

You can modify the file by `helpers.read` and `helpers.write`.

For example:

```ts
export default function (path: string, helpers: {
  read: (path: string) => string
  write: (path: string, content: string) => void
}) {
  const target = `${path}/.github/renovate.json`
  const content = helpers.read(target)
  if (!content) {
    write(target, JSON.stringify({
      extends: ['config:base'],
    }, null, 2))
  }
}
```
