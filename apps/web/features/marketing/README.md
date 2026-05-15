# `features/marketing`

Komponen pemasaran / landing untuk `@looma/web`. Impor lintas modul hanya dari shared (`@/components`, `@/lib`, …) atau dari file lain dalam feature ini — tanpa barrel `index.ts`.

## `components/`

| File | Tanggung jawab |
|------|------------------|
| `landing-page.tsx` | Komposisi halaman utama (orkestrasi section). |
| `landing-header.tsx` | Header sticky + nav + auth CTA. |
| `landing-hero-section.tsx` | Hero + `HeroReplayShowcase`. |
| `integration-harness-section.tsx` | Integrasi harness + frame crosshair. |
| `landing-demo-section.tsx` | Section `#demo` (intro + grid). |
| `demo-feature-grid.tsx` | Grid fitur demo (`#features`). |
| `workflow-section.tsx` | Section `#workflow` + layout frame. |
| `workflow-copy-block.tsx` | Blok teks workflow. |
| `workflow-code-panel.tsx` | Panel kode monospace. |
| `workflow-diagram.tsx` | Diagram alur replay. |
| `technical-crosshair-frame.tsx` | Frame garis + titik; horizontal rule internal. |
| `bottom-cta-section.tsx` | CTA bawah. |
| `landing-footer.tsx` | Footer + `footerHrefFor`. |
| `landing-demo-session-preview.tsx` | Pratinjau sesi (client). |

Route `app/page.tsx` hanya mengimpor `LandingPage` dari sini.
