# `utils/`

Fungsi murni (pure functions) yang dipakai lintas feature: format tanggal, format durasi, parsing string, dll.

Konvensi:

- Pure function, tanpa side effect, tanpa dependency framework (tidak boleh `import "react"` di sini).
- Jika fungsi terikat library tertentu (Supabase client, fetch wrapper), letakkan di `lib/` (bukan `utils/`).
- Util kecil yang hanya milik satu komponen UI tetap satu file dengan komponennya.

Contoh yang sudah ada: [`lib/utils.ts`](../lib/utils.ts) — `cn()` untuk Tailwind. `cn` boleh dipindah ke `utils/` ketika ada kesempatan; tetapi saat ini `cn` lazim diakses sebagai `@/lib/utils` di banyak komponen shadcn, jadi biarkan dulu untuk menghindari diff besar.
