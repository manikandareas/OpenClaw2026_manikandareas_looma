# `testing/`

Util tes bersama: mock factories, MSW handlers, custom render helpers, dan setup file.

Struktur target (saat tooling tes ditambahkan):

```
testing/
├── setup.ts           # vitest setup (jest-dom, dll)
├── render.tsx         # custom render Testing Library yang membungkus providers
├── mocks/
│   ├── handlers.ts    # MSW request handlers
│   └── server.ts      # MSW node server untuk Vitest
└── factories/
    ├── session.ts     # buildSession() factory
    └── event.ts
```

Strategi tes (Bulletproof):

| Layer        | Tool                           | Yang ditest                                |
| ------------ | ------------------------------ | ------------------------------------------ |
| Komponen     | Vitest + Testing Library       | Render output, interaksi user, a11y        |
| Hooks        | Vitest + `renderHook`          | State changes, side effects                |
| API          | Vitest + MSW                   | Request/response handling, error states    |
| Integration  | Vitest + Testing Library + MSW | Full feature flow (render → interact → assert) |
| E2E          | Playwright                     | Critical user journey                      |

Setup runner (Vitest, Playwright, dependencies) sengaja **belum** ditambahkan di bootstrap ini agar diff tetap fokus. Tambahkan saat fitur tes pertama dibuat.
