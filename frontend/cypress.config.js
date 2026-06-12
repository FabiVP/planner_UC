import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    video: true,
    screenshotOnRunFailure: true,
    reporter: 'junit',
    reporterOptions: {
      mochaFile: '../docs/testing/cypress-results-[hash].xml',
    },
  },
});
