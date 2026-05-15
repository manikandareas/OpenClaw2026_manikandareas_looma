# `hooks/`

Custom hooks yang dipakai **lintas feature**. Hooks yang hanya dipakai oleh satu feature harus tinggal di `features/<nama>/hooks/`.

Konvensi:

- Nama file: `use-<nama>.ts` (kebab-case), nama hook: `useNama` (camelCase, awalan `use`).
- Hook harus pure & dapat di-test tanpa render component (gunakan `renderHook`).
- Jangan menyimpan state global di sini — pakai `stores/` (Zustand/Jotai) atau context provider di `providers/`.

Promosi dari feature ke shared dilakukan ketika hook benar-benar dipakai oleh **2+ feature** atau oleh shared component.
