# `example-feature/`

**Modul contoh.** Ini bukan bagian dari produk Looma — folder ini hanya menunjukkan pola feature module Bulletproof di repo ini.

Struktur yang ditampilkan:

```
example-feature/
├── api/
│   └── get-examples.ts       # fungsi API murni + (opsional) query hook
├── components/
│   └── example-list.tsx      # komponen feature yang memakai api/
└── types/
    └── example.ts            # tipe khusus feature
```

## Pola yang ditiru

1. Fungsi API murni dipisah dari hook. Komponen klien memakai hook; Server Component bisa langsung memanggil fungsi.
2. Tipe khusus feature tinggal di `types/` lokal feature, bukan di `apps/web/types/`.
3. Komposisi di route: `app/<route>/page.tsx` mengimpor `<ExampleList />` dari sini, bukan sebaliknya.
4. Tidak ada barrel `index.ts` — impor langsung ke file modul.

## Cara menghapus

Begitu feature nyata pertama (mis. `features/sessions/`, `features/replay/`) sudah mengikuti pola yang sama, hapus folder ini sepenuhnya:

```bash
rm -rf apps/web/features/example-feature
```

Lalu hapus semua impor yang merujuk ke modul ini (di repo bootstrap, tidak ada — modul ini tidak dipakai oleh route atau komponen lain).
