---
"@toruslabs/broadcast-channel": major
---

Require Node `>=24.22.0` and npm `>=12`. Publish TypeScript declarations from `dist/lib.cjs/index.d.ts`. Version 13.3.0 published them in `dist/lib.cjs/types/`. Remove the `@babel/runtime` dependency. The Vite+ build does not reference it.

Publish one bundled file per format. Version 13.3.0 published one file per module, so an import of a path inside `dist/`, such as `dist/lib.cjs/methods/native.js`, no longer resolves. The browser bundles `dist/lib/browser.js` and `dist/lib/browser.min.js` stay at the same paths and still set the global `BroadcastChannel`.

The CommonJS and ES module files are no longer transpiled by Babel. They keep modern syntax such as optional chaining and class fields. A bundler that targets old browsers must transpile this package.

Update `@toruslabs/constants` to 17, `@toruslabs/eccrypto` to 8 and `@toruslabs/metadata-helpers` to 9.
