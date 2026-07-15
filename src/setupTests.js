// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom doesn't provide TextEncoder/TextDecoder, which the Firebase
// SDK needs when it loads. Polyfill from Node's util module.
import { TextEncoder, TextDecoder } from 'util';
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// jsdom also doesn't provide the fetch/stream APIs the Firebase SDK's
// Node build touches at import time (auth's TOTP module). Polyfill
// from Node's own web-standard implementations.
const { ReadableStream, WritableStream, TransformStream } = require('node:stream/web');
if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = ReadableStream;
}
if (typeof global.WritableStream === 'undefined') {
  global.WritableStream = WritableStream;
}
if (typeof global.TransformStream === 'undefined') {
  global.TransformStream = TransformStream;
}

const { fetch, Headers, Request, Response } = require('undici');
if (typeof global.fetch === 'undefined') {
  global.fetch = fetch;
  global.Headers = Headers;
  global.Request = Request;
  global.Response = Response;
}
