module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-empty': [0], // تعطيل شرط وجود type
    'subject-empty': [0], // تعطيل شرط وجود subject

    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'chore',
        'style',
        'refactor',
        'ci',
        'test',
        'perf',
        'revert',
        'vercel',
      ],
    ],
  },
};
