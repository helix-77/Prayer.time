# AMO Source Code Build Instructions

This document provides the exact steps to build this extension from source and reproduce store packages.

## Operating System / Build Environment

- Tested on Windows 11 (PowerShell 5.1)
- Also expected to work on Linux/macOS with Bash

## Required Programs

- Node.js 20.19+ (or Node.js 22 LTS)
- npm 10+

Install Node.js from <https://nodejs.org/>

## Source Package Contents

The source submission includes human-authored files only:

- `src/` (TypeScript/React source)
- `public/` (icons + base manifest)
- `index.html`
- `package.json`
- `package-lock.json`
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- `vite.config.ts`
- `eslint.config.js`
- `package.js` (store packaging build script)
- `README.md`
- `AMO_SOURCE_BUILD.md` (this file)

The source submission does **not** include `dist/` or `node_modules/`.

## Step-by-Step Build (Exact Reproduction)

1. Open a terminal in the project root.
2. Install dependencies:

   ```bash
   npm ci --legacy-peer-deps
   ```

3. Build the extension bundle:

   ```bash
   npm run build
   ```

   Output: `dist/`

4. Generate store-specific packages:

   ```bash
   node package.js
   ```

   Outputs:

   - `prayer-time-firefox.zip`
   - `prayer-time-edge.zip`

## Notes for Reviewers

- The web app source is under `src/` and is not minified/transpiled in this source package.
- Minified/transpiled files are generated only in `dist/` during `npm run build`.
- Firefox-specific manifest adjustments are applied by `package.js` during packaging.
