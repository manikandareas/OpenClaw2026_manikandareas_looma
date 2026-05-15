# `providers/`

Komponen client-side provider yang dipasang dari `app/layout.tsx` (atau layout segment lain).

Karena `app/layout.tsx` adalah Server Component, provider yang membutuhkan React Context (TanStack Query, theme, analytics, dll.) harus dibungkus komponen tipis `"use client"` di sini, lalu di-import dari layout.

Contoh struktur:

```
providers/
├── query-provider.tsx     # QueryClientProvider (TanStack Query)
├── theme-provider.tsx     # next-themes wrapper
└── app-providers.tsx      # composer: gabungkan beberapa provider menjadi satu
```

Pola pemakaian dari `app/layout.tsx`:

```tsx
import { AppProviders } from "@/providers/app-providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
```

Aturan:

- Provider **selalu** komponen `"use client"`.
- Jaga provider tetap tipis: konfigurasi (mis. `QueryClient` options) idealnya berada di `config/` agar dapat di-test terpisah.
- Jangan letakkan logika domain di sini — provider hanya menyediakan context.
