---
name: verify
description: Verify Arcade Vault changes compile, lint, and build. Use before declaring any implementation done or before committing.
---

Run these from the repo root, in order, and stop at the first failure to fix it:

1. `npx tsc --noEmit` — type check (TS strict).
2. `npm run lint` — ESLint (next core-web-vitals + typescript).
3. `npm run build` — production build; catches Cache Components errors (e.g. uncached dynamic data outside `<Suspense>`) that dev mode may only warn about.

Report each step as pass/fail with the relevant error output. If a step fails, fix the root cause and re-run from that step. Never disable lint rules or add `// @ts-ignore` to make it pass without telling the user.

There is no test suite yet; say so rather than claiming tests passed.
