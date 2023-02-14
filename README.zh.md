# Effso

[English](./README.md) / 简体中文

> **Warning**
> 注意 Effso 仍然处于早期开发阶段，API 不稳定。请自行承担风险。

## 为什么

想象一下这样一个场景：

每次初始化一个新项目，你都需要复制一些配置文件，比如 `.editorconfig` 文件。

一个 starter-template？是的，这是一个很好的想法，但也有一些问题。

1. starter-template 无法将通用的文件，比如 `.editorconfig` 和 `.gitignore`，与项目文件分离。
2. starter-template 不够通用。维护多个 starter-template 对于多个主题（比如 `TypeScript` 或 `Nuxt`）是很困难的。
3. 维护一个 starter-template 是一件很困难的事情。（比如，你想要修改 `.editorconfig` 文件，你需要更新所有的 starter-template。）

所以为什么不让它更加原子化？

Effso 基于原子化的概念，它是一个帮助你更高效地操作文件和目录的工具。

Effso 读取用户预定义的规则，并通过一些方式操作文件。

## 安装

```bash
pnpm i -g effso
```

## 设置

```bash
effso setup
```

将在你的 home 目录下生成一个 `.effso/example` 目录。

它生成一些简单的例子：

- `main.json`
- `.editorconfig`
- `.gitignore`
- `eslint.pkg.ts`
- `renovate.file.ts`

## 使用

```bash
# 在你的项目目录下运行
effso run
```

将显示一个选择器，你可以选择你想要运行的规则。

它将读取 `~/.effso/*` 以生成规则。一级目录将成为一个选项。

当你选择一个规则时，它将读取目录中的文件，并通过预定义的规则操作当前工作区文件。

### 规则

#### `main.json`

配置当前根选项默认选中的规则。

目前仅支持 `JSON`。如果没有提供 `main.json`，将没有默认选中的规则。

```json
{
  "default": [
    ".gitignore",
    ".editorconfig",
    "eslint.pkg.ts",
    "renovate.file.ts"
  ]
}
```

#### 单独文件

每个单独的文件选择将会覆盖当前工作区文件。

#### *.pkg.ts

如果当前工作区存在 `package.json`，将通过传递 `package.json` 执行此规则。

注意，此文件只能有一个函数，函数名必须为 `main`，并且只能接受一个参数。

```ts
function main(pkg: Record<string, any>) {
  // do something...
}
```

#### *.file.ts

将通过传递当前工作区路径执行此规则。

与 `*.pkg.ts` 相同，此文件只能有一个函数，其名称必须为 `main`，并且只能接受两个参数。

```ts
function main(path: string, helpers: {
  read: (path: string) => string
  write: (path: string, content: string) => void
}) {
  // to something
}
```

你可以通过 `helpers.read` 和 `helpers.write` 修改文件。

例如：

```ts
function main(path: string, helpers: {
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
