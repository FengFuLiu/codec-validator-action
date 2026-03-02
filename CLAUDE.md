# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dual-purpose project: a **GitHub Action** and **npm package** for validating `codec.json` files against BACnet specification and data type rules. Written in TypeScript targeting Node.js 20+.

## Commands

```bash
npm test                # Run all tests (Node.js built-in test runner via tsx)
npm run test:watch      # Run tests in watch mode
npm run build           # Build both action and library
npm run build:action    # Bundle GitHub Action with @vercel/ncc → dist/action/
npm run build:lib       # Compile npm package with tsc → dist/
```

Run a single test file:
```bash
npx tsx --test tests/fields/id.test.ts
```

**Important:** The `dist/` directory is committed to git. CI checks for uncommitted changes after build, so always run `npm run build` before committing if source files changed.

## Architecture

**Two entry points:**
- `src/main.ts` — GitHub Action entry. Reads inputs via `@actions/core`, runs validation, generates GitHub Actions summary report.
- `src/index.ts` — npm package export. Re-exports `CodecValidator` class and types.

**Core validation engine** lives in `src/test/`:
- `index.ts` — `CodecValidator` class with `validateCodecJson(path)` method. Reads JSON, iterates objects through all validators, collects errors/warnings.
- `types.ts` — `CodecJson`, `CodecObject`, `ValidationResult` interfaces.
- `validation-rules.ts` — Rule mapping tables (access_mode→bacnet_type, data_type→bacnet_type, data_type→value_type).
- `fields/` — 13 field validators (id, name, description, access_mode, data_type, value_type, bacnet_type, unit, bacnet_unit_type_id, bacnet_unit_type, value, max_length, reference).
- `relationships/` — 4 cross-field validators (access-mode, data-type, unit, reference).

**Validator pattern:** Each validator is a class with a static `validate(obj, allObjects?)` method returning `ValidationResult { valid, id, message, severity }`. Severity is either `'error'` or `'warning'`.

**BACnet units:** `src/utils/bacnet-units.ts` contains 270+ standard BACnet unit definitions used by unit-related validators.

## Testing

Tests are in `tests/` using Node.js built-in `node:test` and `node:assert`. Helper utilities in `tests/helpers.ts` provide `createTestCodecObject()` for base test fixtures and byte-length string generators that handle multi-byte UTF-8 characters.

## TypeScript Configuration

- `tsconfig.json` — Base config (ES2022, commonjs, strict).
- `tsconfig.lib.json` — Library build config. Extends base, generates `.d.ts` files, excludes `src/main.ts`, outputs to `dist/`.
