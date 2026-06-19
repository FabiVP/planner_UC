import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setupTests.js'],
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['html', 'lcov', 'text', 'clover', 'json'],
      reportsDirectory: './coverage',
      reportOnFailure: true,
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/**/*.{test,spec}.{js,jsx}',
        'src/tests/**',
        'src/main.jsx',
        '**/node_modules/**',
      ],
    },
    globals: true,
    css: false,
    server: {
      deps: {
        inline: ['msw'],
      },
    },
  },
});
