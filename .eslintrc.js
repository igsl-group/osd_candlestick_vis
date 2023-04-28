module.exports = {
  root: true,
  extends: ['@elastic/eslint-config-kibana', 'plugin:@elastic/eui/recommended'],
  rules: {
    '@osd/eslint/require-license-header': 'off',
  },
  settings: {
    'import/resolver': {
      '@osd/eslint-import-resolver-kibana': {
        'rootPackageName': 'candlestick_chart'
      }
    }
  }
};
