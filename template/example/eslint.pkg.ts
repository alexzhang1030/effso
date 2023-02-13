export default function (pkg: Record<string, any>) {
  return {
    ...pkg,
    'simple-git-hooks': {
      'pre-commit': 'pnpm exec lint-staged',
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
