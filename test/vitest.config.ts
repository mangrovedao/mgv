import { join, resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: [
      { find: '~mgv', replacement: resolve(__dirname, '../src') },
      { find: '~test', replacement: resolve(__dirname, '.') },
    ],
  },
  test: {
    alias: {
      '~mgv': join(__dirname, '../src'),
      '~test': join(__dirname, '.'),
    },
    benchmark: {
      outputFile: './bench/report.json',
      reporters: process.env.CI ? ['default'] : ['verbose'],
    },
    coverage: {
      all: false,
      provider: 'v8',
      reporter: process.env.CI ? ['lcov'] : ['text', 'json', 'html'],
      exclude: [
        '**/errors/utils.ts',
        '**/_cjs/**',
        '**/_esm/**',
        '**/_types/**',
        '**/*.test.ts',
        '**/test/**',
      ],
    },
    environment: 'node',
    include: ['src/**/*.test.ts'],
    setupFiles: [join(__dirname, './setup.ts')],
    globalSetup: [join(__dirname, './globalSetup.ts')],
    hookTimeout: 20_000,
    testTimeout: 20_000,
    teardownTimeout: 10_000,
  },
})
