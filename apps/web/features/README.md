# `features/`

Setiap subfolder adalah satu **feature module** (domain produk Looma) yang terisolasi.

Struktur tipikal sebuah feature:

```
features/<nama-feature>/
├── api/          # fungsi API + query/mutation hooks (TanStack Query opsional)
├── components/   # komponen khusus feature ini
├── hooks/        # hooks khusus feature ini
├── types/        # tipe TypeScript khusus feature ini
└── utils/        # util murni khusus feature ini
```

Subfolder hanya dibuat ketika benar-benar dibutuhkan — jangan buat folder kosong.

## Aturan impor

- Komposisi feature dilakukan di `app/` (route segments). Route memanggil komponen feature, bukan sebaliknya.
- **Dilarang impor silang antar-feature.** `features/A` tidak boleh mengimpor dari `features/B`. Jika dua feature membutuhkan kode yang sama, promosikan ke folder shared (`components/`, `hooks/`, `lib/`, `utils/`, `types/`, `config/`).
- Boleh impor dari shared (`@/components`, `@/hooks`, `@/lib`, `@/utils`, `@/types`, `@/config`) dan dari `@looma/shared` (workspace package).
- Hindari barrel `index.ts` besar di feature — impor langsung ke file untuk tree-shaking yang lebih baik (Vercel `bundle-barrel-imports`).

## Contoh feature

`example-feature/` adalah ilustrasi struktur. **Boleh dihapus** begitu feature nyata pertama mengadopsi pola yang sama.
