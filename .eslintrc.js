module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'react-app'
  ],
  rules: {
    "react/prop-types": 0,
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "react/jsx-handler-names": 0,
    "experimentalDecorators": 0,
    "template-curly-spacing": [0, "never"], //大括号内是否允许不必要的空格
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'quotes': ['error', 'double'],
    "semi": ['error', "never"]
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      }
    }
  ]
}
