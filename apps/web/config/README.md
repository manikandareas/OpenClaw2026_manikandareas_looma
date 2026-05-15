# `config/`

Konstanta aplikasi dan validasi environment variable (Zod) yang dapat di-import dari mana saja tanpa membawa dependency berat.

Contoh isi:

```
config/
├── env.ts          # parse + validasi process.env via Zod
├── routes.ts       # konstanta path route ("/dashboard", "/sessions", ...)
└── query-client.ts # default QueryClient options jika TanStack Query dipakai
```

Catatan migrasi:

- File [`lib/env.ts`](../lib/env.ts) saat ini berperan sebagai env loader. Boleh dipindahkan ke `config/env.ts` ketika ada kesempatan, sehingga `lib/` murni untuk wrapper library pihak ketiga (Supabase, dll). Lakukan sebagai PR terpisah agar diff tetap kecil.

Aturan:

- File di sini tidak boleh memiliki side effect saat di-import (selain validasi env).
- Tidak boleh impor dari `features/` atau `app/`.
