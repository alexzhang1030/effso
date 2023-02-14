function main(pkg: Record<string, any>) {
  return {
    ...pkg,
    'simple-git-hooks': {
      'pre-commit': 'pnpm exec lint-staged ---2',
    },
    'lint-staged': {
      '*.{js,ts,json,md,yaml,yml}': [
        'eslint --fix',
      ],
    },
    'eslintConfig': {
      extends: '@antfu/eslint-config-ts',
    },
  }
}
