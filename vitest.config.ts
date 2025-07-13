import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.{test,spec}.{js,ts}'],
    coverage: {
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{js,ts}'],
      exclude: ['src/**/*.d.ts', 'src/index.ts']
    }
  }
});