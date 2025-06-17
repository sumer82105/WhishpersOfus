// Polyfill for global variable required by sockjs-client
if (typeof global === 'undefined') {
  (window as any).global = globalThis;
} 