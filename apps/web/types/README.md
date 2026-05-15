# `types/`

Tipe TypeScript yang dipakai **lintas feature** atau lintas layer (mis. tipe domain inti, tipe util generik).

Tipe yang hanya milik satu feature tetap di `features/<nama>/types/`. Tipe DTO API milik shared package biasanya berada di [`packages/shared`](../../../packages/shared) dan diimpor sebagai `@looma/shared`.

Konvensi:

- Nama file: kebab-case (`session.ts`, `event.ts`).
- Hindari `any`. Untuk struktur tidak diketahui, pakai `unknown` lalu narrow dengan Zod.
