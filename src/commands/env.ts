export function genShellCheckScript() {
  const hook = `
  if [[ -d "./.effso" ]]; then
    effso build
  fi
  `

  return `
  autoload -U add-zsh-hook
  _effso_autoload_hook () {{
     ${hook}
  }}

  add-zsh-hook chpwd _effso_autoload_hook \
    && _effso_autoload_hook`
}
