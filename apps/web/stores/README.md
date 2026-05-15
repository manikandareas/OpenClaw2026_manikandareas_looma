# `stores/`

Client state global (Zustand / Jotai / dst). Kosong saat bootstrap — buat store hanya ketika benar-benar perlu.

Pemisahan jenis state (Bulletproof):

| Jenis state             | Tempat                          |
| ----------------------- | ------------------------------- |
| Server state            | TanStack Query di `features/*/api/` |
| Client state global     | `stores/` (file ini)            |
| Client state lokal      | `useState` / `useReducer` di komponen |
| URL state               | Next.js router / `searchParams` |
| Form state              | React Hook Form di komponen form |

**Jangan** menyalin hasil query ke `useState`. Source of truth tetap di TanStack Query cache.
