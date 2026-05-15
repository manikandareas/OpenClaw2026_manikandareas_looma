# AGENTS.md — Looma

Panduan untuk **agen AI dan kontributor manusia** yang mengubah kode di repo ini. Tujuannya menjaga arsitektur web app tetap konsisten, dapat dipahami, dan performant.

## Scope

Repo Looma adalah monorepo Bun dengan workspaces `apps/*` dan `packages/*`. Dokumen ini berlaku untuk seluruh repo, dengan fokus utama pada [`apps/web/`](apps/web) (Next.js 16 App Router + React 19 + Tailwind 4 + Supabase).

Workspaces saat ini:

- [`apps/web`](apps/web) — Next.js web app (`@looma/web`).
- [`packages/shared`](packages/shared) — tipe & util lintas workspace (`@looma/shared`).
- [`packages/mcp-server`](packages/mcp-server) — MCP server lokal untuk integrasi agent harness.

## Skill referensi

Bila Anda menjalankan agen di Cursor / Claude / Codex yang memiliki skill berikut, **gunakan dan ikuti skill tersebut** sebelum menulis kode UI/data:

| Skill                              | Sumber upstream                                                                                                                                            |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Bulletproof React Patterns**     | [github.com/alan2207/bulletproof-react](https://github.com/alan2207/bulletproof-react)                                                                     |
| **Vercel React Best Practices**    | Panduan performa React/Next.js dari Vercel Engineering ([vercel.com/blog](https://vercel.com/blog) — kategori React/Next.js performance)                   |

Dokumen ini adalah **ringkasan operatif** dari kedua skill di atas yang sudah disetel untuk konteks Looma. Bila terjadi konflik, skill upstream menang untuk hal yang dijelaskannya secara spesifik; AGENTS.md menang untuk keputusan khusus repo (mis. "tanpa folder `src/`").

## Layout `apps/web` (tanpa folder `src/`)

Path alias `@/` di [`apps/web/tsconfig.json`](apps/web/tsconfig.json) menunjuk ke root [`apps/web`](apps/web). **Jangan** memperkenalkan folder `src/`.

```
apps/web/
├── app/         # Next.js App Router (route, layout, route handler)
├── components/  # UI bersama (presentational, termasuk components/ui/* shadcn)
├── features/    # modul fitur per domain (Bulletproof feature module)
├── providers/   # client provider (TanStack Query, theme, dll)
├── config/      # konstanta, env (Zod), config TanStack Query, dll
├── hooks/       # hooks bersama lintas feature
├── lib/         # wrapper library pihak ketiga (Supabase, helper API)
├── stores/      # client state global (Zustand/Jotai)
├── types/       # tipe TypeScript bersama
├── utils/       # fungsi murni bersama
├── assets/      # asset yang di-bundle (SVG-as-component, font lokal)
├── testing/     # util tes, mock factories, MSW handlers
└── public/      # asset statis URL (favicon, og image, dst.)
```

Setiap folder memiliki `README.md` yang menjelaskan tujuan dan aturannya. Baca README folder sebelum menambah file di sana.

### Bentuk feature module

```
features/<nama-feature>/
├── api/         # fungsi API + query/mutation hooks
├── components/  # komponen feature
├── hooks/       # hooks feature
├── types/       # tipe feature
└── utils/       # util feature
```

Buat subfolder hanya bila benar-benar dipakai.

## Aturan arsitektur (wajib)

1. **Alur impor satu arah:** `shared (components|hooks|lib|utils|types|config) → features → app`.
2. **Tidak ada impor silang antar-feature.** `features/A` dilarang mengimpor dari `features/B`. Kalau dua feature membutuhkan kode yang sama, promosikan ke folder shared.
3. **Route segment di `app/` adalah komposisi.** Halaman memanggil komponen feature, bukan menampung logika domain.
4. **`components/ui/*` tidak memiliki logika domain.** Hanya primitives presentational (shadcn-style).
5. **Server Components default.** Tambahkan `"use client"` hanya pada batas yang perlu (form, hook stateful, library yang menyentuh `window`).
6. **Provider berada di `providers/`** sebagai komponen `"use client"` tipis, lalu di-import dari `app/layout.tsx`.
7. **State server vs client terpisah.** Hasil query (TanStack Query) **jangan** disalin ke `useState`. Kategorisasi state mengikuti tabel di [`stores/README.md`](apps/web/stores/README.md).
8. **Pakai alias `@/`** untuk impor lintas folder dalam `apps/web` (mis. `@/components/ui/button`). Hindari relative path panjang seperti `../../../../`.
9. **Hindari barrel `index.ts` luas.** Impor langsung ke file modul untuk membantu tree-shaking Next/Turbopack.
10. **Penamaan:** direktori dan file kebab-case (`app-nav.tsx`, `user-settings/`); komponen PascalCase di dalam file; hook `useNama`; konstanta `UPPER_SNAKE_CASE`; tipe PascalCase.

## Aturan performa Next.js + React (ringkasan Vercel)

ID aturan di bawah merefer ke skill **Vercel React Best Practices** — gunakan ID untuk pencarian cepat di rules skill tersebut.

### Kritis

- `async-parallel` — Pekerjaan independen di Server Component / route handler harus `Promise.all`, bukan `await` berantai.
- `async-defer-await` — `await` ditempatkan di cabang yang benar-benar memakai hasilnya.
- `bundle-barrel-imports` — Hindari barrel besar; impor langsung dari modul.
- `bundle-dynamic-imports` — Komponen klien berat (Monaco/CodeMirror, xterm.js, react-diff-viewer) → `next/dynamic` dengan `ssr: false` jika perlu.
- `bundle-defer-third-party` — Analytics/logging dimuat setelah hydration / saat idle.

### Tinggi

- `server-cache-react` — Pakai `React.cache()` untuk dedup per-request di Server Components.
- `server-serialization` — Minimalkan props yang dikirim Server → Client Component.
- `server-parallel-fetching` — Pisahkan komponen yang fetch independen agar bisa stream paralel.

### Menengah

- `client-swr-dedup` / TanStack Query — Dedup request di klien.
- `rerender-memo`, `rerender-derived-state`, `rerender-functional-setstate` — Hindari re-render tidak perlu pada komponen mahal.
- `rendering-conditional-render` — Pakai ternary, bukan `&&`, untuk conditional render yang menghasilkan element berbeda.

Daftar lengkap: lihat skill **Vercel React Best Practices**.

## Workflow agen di repo ini

1. **Sebelum menulis kode baru:** baca README folder tujuan + AGENTS.md ini. Cek apakah ada feature/komponen yang sudah ada — perpanjang, jangan duplikat.
2. **Saat menambah feature baru:** buat folder `features/<nama-feature>/` dan subfolder seminimal mungkin. Komposisi di `app/<route>/page.tsx`.
3. **Saat butuh kode bersama:** mulai di feature; promosikan ke shared (`components/`, `hooks/`, `lib/`, `utils/`, `types/`, `config/`) hanya kalau dipakai 2+ feature.
4. **Saat menambah dependency:** tambahkan ke workspace yang tepat (`apps/web` untuk UI, `packages/shared` untuk lintas-workspace). Jangan duplikasi versi.
5. **Saat menyentuh path domain agent (`record_*` MCP, lens-agent processing, dll.):** rujuk [`looma_docs/PRD.md`](looma_docs/PRD.md) untuk istilah dan kontrak event.

## Boilerplate cycle

Bootstrap repo ini menyertakan modul contoh di [`apps/web/features/example-feature/`](apps/web/features/example-feature) sebagai ilustrasi struktur. Modul ini **boleh — dan seharusnya — dihapus** ketika feature nyata pertama mengadopsi pola yang sama (jangan biarkan jadi kode mati).

Saat menghapus contoh:

- Hapus folder `features/example-feature/`.
- Hapus impor / route apa pun yang merujuk ke contoh.
- Setelah penghapusan, **AGENTS.md ini dan README per folder tetap menjadi sumber kebenaran** untuk konvensi struktur.

## Checklist sebelum mengirim PR

- [ ] Tidak ada impor silang antar-`features/*`.
- [ ] Tidak ada folder `src/` baru di `apps/web`.
- [ ] Impor lintas folder pakai alias `@/` (atau `@looma/shared`).
- [ ] `components/ui/*` bebas logika domain.
- [ ] Komponen klien dibatasi: `"use client"` hanya di file yang membutuhkan.
- [ ] Library berat dibungkus `next/dynamic` bila tidak perlu di server.
- [ ] Fetch independen di Server Component dilakukan paralel (`Promise.all`).
- [ ] Tidak ada barrel `index.ts` baru di `features/`.
- [ ] State server tidak disalin ke `useState`.
- [ ] `bun typecheck` dan `bun lint` lulus.
- [ ] Bila menyentuh contoh boilerplate, contoh dihapus utuh, bukan setengah.

## Perintah workspace

```bash
bun dev          # next dev di apps/web
bun build        # build semua workspace
bun lint         # eslint semua workspace
bun typecheck    # tsc --noEmit semua workspace
bun mcp          # start packages/mcp-server
```
