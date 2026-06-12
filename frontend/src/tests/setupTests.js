import React from 'react';
import '@testing-library/jest-dom/vitest';
globalThis.React = React;
import { cleanup } from '@testing-library/react';
import { afterEach, afterAll, beforeAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
