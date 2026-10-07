import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  // Fichiers/dossiers ignorés
  {
    ignores: ['node_modules/', 'coverage/', 'dist/'],
  },

  // Règles recommandées ESLint
  js.configs.recommended,

  // Configuration du projet (ES Modules + Node)
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module', // Impose import/export
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Interdit require() : le projet est 100% ES Modules
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.name='require']",
          message: 'Utilisez import/export (ES Modules), pas require().',
        },
        {
          selector: "MemberExpression[object.name='module'][property.name='exports']",
          message: 'Utilisez export/export default, pas module.exports.',
        },
      ],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // Fichiers de test : globals Vitest
  {
    files: ['tests/**/*.js'],
    rules: {
      'no-console': 'off',
    },
  },

  // Désactive les règles ESLint en conflit avec Prettier (doit rester en dernier)
  prettier,
];
