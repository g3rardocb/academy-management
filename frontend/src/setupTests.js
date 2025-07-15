/* eslint-disable no-undef */
/* eslint-env jest */

import { TextEncoder, TextDecoder } from 'util';
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

// 2) Matchers de Testing Library
import '@testing-library/jest-dom';

// 3) MSW: servidor de mocks para interceptar llamadas HTTP
import { server } from './mocks/server';

// 4) Ciclo de vida de MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());