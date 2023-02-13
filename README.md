# Effso

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

will generate a `.effso` directory in your home directory.
