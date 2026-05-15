# `assets/`

Asset statis yang **di-bundle** oleh Next/Turbopack (mis. SVG yang di-import sebagai komponen, font lokal, ilustrasi yang ikut tree-shaken).

Untuk asset yang diakses sebagai URL langsung (favicon, og image statis, file publik), pakai folder [`public/`](../public) — bukan folder ini.

Pedoman:

- SVG sebagai komponen: `assets/icons/<nama>.svg` lalu `import Icon from "@/assets/icons/nama.svg"`.
- Font lokal: `assets/fonts/<nama>/*` (saat ini font dimuat lewat `next/font` dari Google, jadi folder ini boleh tetap kosong sampai dibutuhkan).
