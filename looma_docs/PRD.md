# PRD — Looma

## 1. Ringkasan Produk

**Looma** adalah **replay-native review layer** untuk autonomous coding agents.

Developer dapat menjalankan `/record start` atau memanggil MCP tool dari agent harness seperti Claude Code, Codex, OpenCode, OpenClaw, Cline, atau adapter lain. Setelah recording dimulai, Looma menangkap aktivitas agent secara real-time, menormalisasi event coding-agent, lalu menghasilkan **shareable replay artifact**: satu halaman replay compact berisi timeline seperti video, terminal output, file diff, file snapshot, test result, checkpoint, lightweight chapters, AI session notes, dan **Needs Review markers**.

Produk ini bukan evaluator, bukan judge, bukan approval gate, dan bukan automated code review bot. Fokus utama Looma adalah membantu manusia memahami proses kerja autonomous coding agent secara cepat.

Looma menjawab pertanyaan utama:

* Apa yang dilakukan agent?
* File apa yang dibaca atau diubah?
* Command apa yang dijalankan?
* Apakah agent sempat gagal lalu memperbaiki?
* Bagian mana yang perlu saya cek dulu?
* Bisakah session ini dibagikan ke developer lain?

---

## 2. One-liner

**Looma is the Loom for autonomous coding agents.**

Versi lebih detail:

**Looma records autonomous coding-agent sessions and turns them into shareable replay artifacts with synchronized terminal commands, diffs, test results, chapters, and AI-generated Needs Review markers.**

---

## 3. Product Positioning

Looma berada di kategori:

> **Replay-native observability for autonomous coding agents.**

Looma bukan sekadar LLM observability dashboard, bukan browser session replay tool, dan bukan memory layer untuk agent. Produk ini menghasilkan artifact yang bisa ditonton ulang, dipahami, dan dibagikan.

### Indonesian Pitch

**Looma adalah session recorder untuk autonomous coding agents. Developer cukup menjalankan `/record`, lalu Looma merekam aktivitas agent secara real-time dan mengubahnya menjadi replay interaktif seperti video, lengkap dengan timeline, terminal output, diff, test result, chapter ringan, dan marker AI yang menunjukkan bagian penting untuk direview.**

---

## 4. Problem Statement

Developer semakin sering menggunakan autonomous coding agents untuk mengerjakan task seperti bug fixing, refactoring, test writing, feature implementation, migration, atau debugging. Namun ketika agent bekerja cukup lama, developer sering kehilangan konteks atas proses yang terjadi.

Masalah utama:

* Developer hanya melihat hasil akhir, bukan proses kerja agent.
* Raw terminal log terlalu panjang dan sulit dibaca ulang.
* Agent bisa membaca file, menjalankan command, mengubah kode, gagal test, memperbaiki error, dan install dependency tanpa ringkasan yang mudah dipahami.
* Agent bisa terlihat aktif, tetapi sebenarnya mengulang problem yang sama dengan command, file, error, atau output yang mirip tanpa progress yang jelas.
* Developer ingin membiarkan agent bekerja lebih otonom, tetapi tetap butuh cara cepat untuk memahami session setelah selesai.
* Existing LLM observability tools cenderung fokus ke traces, latency, cost, eval, dan platform monitoring.
* Existing browser session replay tools fokus pada user behavior, bukan autonomous coding-agent behavior.
* Built-in logs dari coding agents biasanya tersebar, panjang, local-only, dan tidak dirancang sebagai replay artifact yang bisa dibagikan.

---

## 4.1 Before/After Narrative

### Konsep

Looma menggunakan **before/after visual narrative** untuk membuat value proposition langsung terasa tanpa penjelasan panjang.

### Before (Tanpa Looma)

Developer kembali setelah agent bekerja 20 menit dan melihat:

* Raw terminal log 500+ baris.
* Tidak ada struktur, tidak ada highlight.
* Harus scroll manual untuk memahami apa yang terjadi.
* Tidak tahu bagian mana yang penting.
* Tidak bisa dibagikan ke reviewer lain dengan konteks yang cukup.

### After (Dengan Looma)

Developer membuka satu halaman replay dan melihat:

* Reconstructed screen replay seperti menonton agent bekerja.
* Timeline berwarna (hijau/kuning/merah) yang menunjukkan progress.
* Chapters otomatis yang membagi session ke fase-fase.
* Needs Review markers yang langsung menunjukkan bagian penting.
* AI Session Notes yang merangkum session dalam 3-5 bullet.
* Satu klik untuk jump ke momen penting.

### Penggunaan

Before/after narrative digunakan di:

* **Landing page hero section** — split screen: kiri raw log scrolling, kanan Looma replay.
* **Pitch deck Slide 1** — kontras visual yang langsung bikin audience paham.
* **Demo video opening (0:00–0:15)** — hook yang membuat penonton ingin lihat lebih lanjut.

### Acceptance Criteria

* Landing page menampilkan split comparison (raw log vs Looma replay).
* Kontras terlihat jelas dalam 3 detik pertama.
* Before side menunjukkan raw monospace text yang overwhelming.
* After side menunjukkan structured replay dengan warna, markers, dan chapters.

---

## 5. Core Differentiation

Looma berbeda dari tool lain dalam empat hal utama:

### 5.1 Bukan Generic LLM Observability Dashboard

Tools seperti LangSmith, Langfuse, Arize, Helicone, atau Datadog LLM Observability fokus pada traces, spans, latency, token usage, eval, dan production monitoring.

Looma fokus pada:

* agent coding workflow,
* terminal commands,
* file diffs,
* test results,
* checkpoints,
* review-worthy moments,
* one-page replay experience.

### 5.2 Bukan Browser Session Replay

Tools seperti PostHog, LogRocket, FullStory, OpenReplay, atau Datadog Session Replay merekam user behavior di browser/mobile app.

Looma merekam:

* autonomous agent behavior,
* coding events,
* workspace changes,
* terminal activity,
* test execution,
* file modifications.

### 5.3 Bukan Built-in Agent Log

Claude Code, Codex, Cline, Aider, atau agent harness lain mungkin punya logs, transcripts, hooks, atau checkpoints.

Looma menormalisasi event dari berbagai sumber menjadi satu replay format yang:

* bisa di-scrub seperti video,
* punya marker,
* punya chapter,
* punya AI notes,
* bisa dibagikan sebagai replay link.

### 5.4 Bukan Evaluator atau Judge

Looma tidak menentukan apakah pekerjaan agent benar atau salah.

Looma hanya membantu manusia memahami:

* apa yang terjadi,
* kapan terjadi,
* kenapa momen tertentu penting untuk dilihat,
* bagian mana yang sebaiknya dicek dulu.

---

## 6. What Looma Is Not

Looma bukan:

* LLM tracing dashboard.
* Browser session replay tool.
* Automated code reviewer.
* AI evaluator.
* Approval gate.
* CI replacement.
* Git history replacement.
* Agent long-term memory system.
* Security scanner penuh.
* Cost dashboard untuk token/agent usage.

Looma adalah:

> **Replay and review-navigation layer for autonomous coding-agent sessions.**

---

## 7. Target Users

### Primary User

Developer yang menggunakan AI coding agent untuk mengerjakan task secara mandiri, misalnya:

* bug fixing,
* refactoring,
* test writing,
* feature implementation,
* migration,
* dependency update,
* auth/security implementation,
* API integration.

### Secondary Users

* Tech lead yang ingin memahami pekerjaan agent sebelum merge.
* Mahasiswa IT yang menggunakan coding agent untuk belajar.
* Researcher yang mempelajari autonomous agent behavior.
* Developer tools team yang ingin memberi visibility pada agent harness.
* Hackathon participant yang memakai coding agent untuk build cepat.

---

## 8. User Persona

### Persona: Developer yang Membiarkan Agent Bekerja Mandiri

Developer memberi instruksi:

> “Implement JWT auth with refresh token.”

Agent bekerja selama 10–30 menit. Developer mungkin membuka tab lain, mengerjakan hal lain, atau menunggu agent selesai.

Setelah kembali, developer ingin tahu:

* Agent mulai dari mana?
* File apa saja yang dibaca?
* File apa saja yang diubah?
* Apakah agent install dependency?
* Apakah ada test gagal?
* Apakah test akhirnya berhasil?
* Apakah ada perubahan di auth/security/config?
* Bagian mana yang perlu saya review dulu?

Looma menjawab ini melalui replay timeline, markers, chapters, dan AI session notes.

---

## 9. Goals

### Product Goals

1. Membuat sesi kerja autonomous coding agent dapat direkam dan diputar ulang seperti video.
2. Mengubah raw agent logs menjadi replay artifact yang mudah dipahami manusia.
3. Membantu developer menemukan momen penting dalam session dalam waktu kurang dari 30 detik.
4. Menyediakan integrasi sederhana melalui MCP, `/record` skill, hooks, adapter, atau import transcript.
5. Menampilkan terminal, diff, file snapshot, test result, marker, chapter, dan notes dalam satu halaman replay compact.
6. Menghasilkan Needs Review markers yang membantu developer menentukan bagian mana yang perlu dicek dulu.
7. Menghasilkan replay link yang bisa dibagikan ke teammate, reviewer, atau tech lead.
8. Menjaga privacy dasar melalui redaction untuk secret, token, password, dan env values.

### Hackathon Goals

1. Demo end-to-end dapat dijalankan dalam waktu singkat.
2. Proyek terlihat fungsional, bukan hanya mock UI.
3. Backend AI agent benar-benar menjalankan workflow otomatis.
4. Stack sederhana dan cost-effective.
5. Bisa demo dengan live simulated recording maupun import transcript.
6. Mudah dijelaskan dalam demo video maksimal 2 menit dan pitch deck maksimal 5 slide.
7. Diferensiasi jelas dari LLM observability, browser session replay, dan built-in logs.
8. Demo terasa cinematic dan hidup (smooth animations, dark mode, recording indicator).
9. Time-to-value kurang dari 5 detik di landing page.
10. Real MCP integration demonstrated, bukan hanya simulated events.

---

## 10. Non-Goals

Untuk versi hackathon, Looma tidak akan membangun:

* Full evaluator kualitas agent.
* Automated code review mendalam.
* Approval/consent workflow kompleks.
* Multi-tenant billing.
* Enterprise-grade access control.
* Dedicated analytics dashboard.
* Restore checkpoint penuh ke state kode sebelumnya.
* Full security scanner.
* Full integration ke semua harness sekaligus.
* Cost dashboard untuk token usage.
* Real-time collaborative commenting.
* Pull request automation penuh.

---

## 11. Core Product Concept

### 11.1 Shareable Replay Artifact

Setiap completed session menghasilkan satu replay artifact yang berisi:

* session metadata,
* timeline aktivitas agent,
* terminal command dan output,
* file diff,
* file snapshot,
* test result,
* checkpoint,
* lightweight chapters,
* Needs Review markers,
* AI session notes,
* important files,
* important commands.

Artifact ini bisa dibuka oleh developer lain tanpa harus membaca raw logs atau memiliki akses langsung ke agent harness asli.

### 11.1.1 Reconstructed Screen Replay Model

Looma menggunakan **reconstructed screen replay** sebagai model visual utama. Terinspirasi oleh pendekatan Manus AI, replay Looma menampilkan satu viewport yang merekonstruksi "layar" agent selama bekerja — seolah-olah user menonton screen recording dari AI agent.

#### Konsep Utama

Replay bukan kumpulan panel terpisah. Replay adalah **satu viewport cinematic** yang berganti mode sesuai aktivitas agent pada timestamp tertentu.

#### Mode Viewport

1. **Terminal Mode** — xterm.js merender terminal dengan typing animation untuk commands dan streaming output.
2. **Editor Mode** — Monaco Editor / CodeMirror menampilkan file dengan cursor bergerak ke line target, text muncul character-by-character.
3. **Diff Mode** — Side-by-side atau inline diff view saat event `file_diff` terjadi.
4. **Test Result Mode** — Formatted test output dengan pass/fail highlighting.
5. **Browser Mode** — Screenshot/iframe view untuk browser snapshots (future, placeholder untuk MVP).

#### Animasi

* **Terminal:** karakter command muncul satu per satu (typing speed adjustable sesuai playback speed). Output streaming muncul line-by-line.
* **Editor:** cursor bergerak ke posisi edit, text muncul character-by-character atau line-by-line. Changed lines di-highlight.
* **Transisi antar mode:** crossfade + subtle scale (0.98 → 1.0) menggunakan framer-motion, durasi 200–300ms.

#### UI Elements

* **Mode indicator badge** di pojok kanan atas viewport (Terminal / Editor / Diff / Test / Browser).
* **File path breadcrumb** saat di Editor atau Diff mode.
* **Playback speed** mempengaruhi kecepatan semua animasi secara proporsional.

#### Acceptance Criteria

* Viewport berganti mode berdasarkan event type pada current timestamp.
* Terminal events menampilkan animated command typing dan output streaming.
* Editor events menampilkan file dengan cursor positioned di lokasi perubahan.
* Transisi antar mode menggunakan animasi (bukan instant cut).
* Playback speed mempengaruhi kecepatan animasi.
* Mode indicator badge menunjukkan state viewport saat ini.

### 11.1.2 Shareable Artifact Metadata

Setiap replay artifact memiliki metadata untuk social sharing dan embedding.

#### OG Meta Tags

Saat replay link dibagikan ke Slack, Twitter, Discord, atau platform lain, preview menampilkan:

* `og:title` — session name (e.g., "Add JWT auth with refresh token").
* `og:description` — AI-generated summary singkat + stats (duration, marker count).
* `og:image` — auto-generated preview image: thumbnail timeline dengan colored segments dan key stats overlay.
* `og:url` — canonical replay URL.

#### Embed Snippet

Developer dapat meng-embed replay mini di PR description, README, atau Notion:

```html
<iframe src="https://looma.app/embed/sess_abc123" width="100%" height="400" frameborder="0"></iframe>
```

Embed view menampilkan: compact timeline, behavior map, dan top markers. Klik "Open full replay" untuk navigasi ke halaman lengkap.

#### Copy-to-Clipboard

Replay page menyediakan:

* Copy replay link button.
* Copy embed snippet button.
* Copy markdown link button (`[Session Name](url)`).

#### Acceptance Criteria

* Shared replay link menampilkan OG preview di Slack/Twitter/Discord.
* Embed iframe merender compact replay view.
* Copy buttons tersedia di replay page.
* Preview image di-generate otomatis dari session data.

### 11.2 One-page Replay Experience

Semua fitur utama berada di satu halaman:

```text
/replay/[sessionId]
```

Halaman ini berisi:

* session header,
* timeline seperti video dengan colored segments,
* chapter strip,
* marker list,
* reconstructed screen replay viewport (single viewport, mode switching),
* collapsible sidebar (event details, markers, chapters),
* AI session notes,
* Needs Review summary.

### 11.3 Review-first Workflow

Looma tidak hanya membuat session bisa ditonton ulang. Looma membantu developer langsung menjawab:

> “Apa yang perlu saya review dulu?”

Saat replay dibuka, user melihat:

* top Needs Review markers,
* important file changes,
* failed-then-fixed tests,
* dependency installs,
* auth/security/config changes,
* large diffs,
* repeated commands/errors,
* possible low-progress loops.

### 11.4 AI as Ambient Intelligence

AI tidak menjadi dashboard besar. AI bekerja di belakang layar untuk:

* mengklasifikasi event,
* mendeteksi phase transition,
* membuat chapter,
* memberi alasan marker,
* membuat session notes,
* membantu navigasi replay.

AI tidak memberi verdict benar/salah.

---

## 12. Coding-Native Replay Model

Looma merepresentasikan agent session sebagai urutan event coding-native.

### Event Categories

#### Intent Events

* prompt,
* agent_message,
* agent_plan,
* task_update.

#### Workspace Events

* file_read,
* file_write,
* file_diff,
* file_snapshot,
* directory_list.

#### Execution Events

* terminal_command,
* terminal_output,
* test_result,
* build_result,
* lint_result.

#### Risk / Review Events

* dependency_install,
* config_change,
* auth_security_change,
* env_file_touch,
* large_diff,
* repeated_failure,
* destructive_command.

#### State Events

* checkpoint,
* browser_snapshot,
* session_start,
* session_stop.

Replay page menyinkronkan semua event ini ke timestamp tertentu. Saat user scrub timeline, viewport akan menunjukkan konteks paling relevan pada saat itu: terminal output, diff, file snapshot, atau event detail.

---

## 13. Key Features

## 13.1 MCP / Skill Trigger

### Description

Developer dapat memulai recording dari agent harness menggunakan slash command:

```text
/record start
```

Atau melalui MCP tool:

```text
record_start()
```

### MVP Behavior

* User menekan tombol “Simulate /record start” di UI demo atau memanggil MCP tool lokal.
* Sistem membuat session baru.
* Status session menjadi `recording`.
* Event mulai dikirim ke backend.
* UI live session mulai menampilkan event stream.

### MCP Tools

Minimal tools:

```text
record_start
record_event
record_snapshot
record_checkpoint
record_stop
get_replay_link
```

### Acceptance Criteria

* User dapat membuat session baru.
* Session memiliki ID unik.
* Session status berubah dari `created` ke `recording`.
* Event dapat dikirim ke session aktif.
* Replay link bisa diambil setelah session selesai.

### 13.1.1 MCP as Native Integration

#### Positioning

MCP (Model Context Protocol) adalah **primary integration path** Looma, bukan fallback atau alternatif. Saat demo dan pitch, MCP integration adalah cerita utama yang menunjukkan bahwa Looma benar-benar terintegrasi dengan coding agent ecosystem.

#### Implementasi

MCP server Looma adalah TypeScript MCP server yang:

* Dapat diinstall via local path di Claude Code MCP config (`~/.claude/settings.json`).
* Menyediakan minimal 3 tools yang benar-benar fungsional: `record_start`, `record_event`, `record_stop`.
* Berkomunikasi langsung dengan Looma backend API.
* Dapat digunakan dari agent harness manapun yang mendukung MCP (Claude Code, OpenCode, dll).

#### MCP Server Config Example

```json
{
  "mcpServers": {
    "looma": {
      "command": "node",
      "args": ["./packages/mcp-server/dist/index.js"],
      "env": {
        "LOOMA_API_URL": "http://localhost:3000/api",
        "LOOMA_API_KEY": "..."
      }
    }
  }
}
```

#### Demo Requirement

Demo harus menunjukkan:

1. Claude Code dengan Looma MCP server terkonfigurasi.
2. Agent memanggil `record_start` → session LIVE di UI.
3. Events mengalir real-time dari agent ke Looma.
4. Agent memanggil `record_stop` → replay diproses.

Simulated event stream tetap tersedia sebagai fallback untuk demo tanpa live agent, tetapi MCP integration adalah primary story.

#### Acceptance Criteria

* MCP server dapat dijalankan dan terhubung ke Claude Code.
* `record_start` membuat session baru dan mengembalikan session ID.
* `record_event` mengirim event ke session aktif.
* `record_stop` menghentikan recording dan trigger processing.
* Demo menunjukkan real MCP integration, bukan hanya simulated events.

### 13.1.2 Hybrid Capture: MCP + Hooks

#### Konsep

Looma menggunakan **hybrid capture model** untuk memastikan semua event ter-capture secara reliable:

* **MCP Tools** (`record_start`, `record_stop`): User memiliki kontrol eksplisit kapan mulai dan berhenti merekam. Ini adalah conscious action.
* **Agent Harness Hooks** (`PostToolCall`): Setiap tool call yang dilakukan agent otomatis ter-capture sebagai event tanpa bergantung pada agent "ingat" mengirim. Ini adalah implicit capture.

#### Mengapa Hybrid

Jika hanya mengandalkan MCP `record_event`, agent harus secara sadar memanggil tool tersebut di setiap langkah. Ini unreliable — agent bisa lupa, skip, atau tidak konsisten. Hooks memastikan **100% event ter-capture** selama recording aktif.

#### Mekanisme State: Active Session File

Hooks perlu tahu apakah sedang ada recording aktif. Solusinya menggunakan file marker lokal:

```text
~/.looma/active_session
```

* `record_start` dipanggil → MCP server menulis session ID ke `~/.looma/active_session`.
* Hook `PostToolCall` → membaca file tersebut. Jika ada → kirim event. Jika tidak ada → skip.
* `record_stop` dipanggil → MCP server menghapus `~/.looma/active_session`.

#### Claude Code Hooks Config Example

```json
{
  "hooks": {
    "PostToolCall": [
      {
        "matcher": "*",
        "command": "node ./packages/hook-bridge/dist/index.js '$TOOL_NAME' '$TOOL_INPUT' '$TOOL_OUTPUT'"
      }
    ]
  }
}
```

#### Recording Scope

* Semua event dalam session agent terus direkam sampai `record_stop` dipanggil.
* Multi-task dalam satu recording di-support — chapter generation akan memisahkan fase secara otomatis.
* User bisa melakukan banyak follow-up prompts dalam satu recording session.

#### Auto-stop (Nice to Have)

* Jika tidak ada event baru selama 30 menit, session otomatis di-stop.
* Mencegah recording "zombie" yang lupa di-stop.

#### Acceptance Criteria

* MCP `record_start` menulis session ID ke `~/.looma/active_session`.
* MCP `record_stop` menghapus `~/.looma/active_session`.
* Hook bridge membaca active session file dan mengirim event ke API.
* Hook bridge skip jika tidak ada active session.
* Multi-task recording menghasilkan events yang continuous dalam satu session.
* Recording berlanjut across multiple user prompts sampai explicit stop.

---

## 13.2 Harness-Agnostic Input Layer

Looma dapat menerima event dari beberapa sumber:

1. MCP tools.
2. `/record` skill atau slash command.
3. Claude Code hooks.
4. Codex/OpenCode/OpenClaw adapters.
5. Cline/Aider transcript adapters.
6. Uploaded JSON/JSONL transcript.
7. Simulated event stream untuk demo.

Untuk MVP hackathon, Looma akan mengimplementasikan:

* MCP/simulated bridge,
* sample event stream,
* import JSON/JSONL transcript.

Adapter tambahan dapat masuk roadmap.

### Acceptance Criteria

* Event dari simulator bisa masuk ke backend.
* Event dari uploaded JSON/JSONL bisa dinormalisasi.
* Semua input source dikonversi ke normalized event schema.
* Replay UI tidak bergantung pada satu harness tertentu.

---

## 13.3 Import Existing Agent Transcript

### Description

User dapat upload transcript agent session yang sudah ada, misalnya JSON/JSONL logs dari coding-agent run, lalu Looma mengubahnya menjadi replay.

### MVP Behavior

* User upload sample JSON/JSONL.
* Sistem membaca raw transcript.
* Sistem menormalisasi event ke Looma schema.
* lens-agent menghasilkan markers, chapters, dan notes.
* User mendapatkan replay link.

### Why This Matters

Fitur ini membuat Looma tetap bisa demo value utama meskipun live MCP integration belum sempurna.

### Acceptance Criteria

* User dapat upload file JSON/JSONL.
* Sistem menghasilkan minimal 20 normalized events dari sample transcript.
* Replay page dapat dibuka dari hasil import.
* Markers, chapters, dan notes tetap dibuat dari imported session.

---

## 13.4 Live Session Capture

### Description

Looma menangkap event aktivitas agent secara real-time.

### Event Types

```text
session_start
prompt
agent_message
agent_plan
tool_call
tool_result
terminal_command
terminal_output
file_read
file_write
file_diff
file_snapshot
dependency_install
test_result
lint_result
build_result
browser_snapshot
checkpoint
session_stop
```

### MVP Input Source

Input event dapat berasal dari:

1. MCP server lokal sederhana.
2. Simulated coding-agent event stream.
3. Upload/sample JSON or JSONL session.

### Acceptance Criteria

* Event tersimpan dengan sequence number.
* Event memiliki timestamp.
* Event tampil di live event stream.
* UI update saat event baru masuk.
* Event dapat direplay setelah session selesai.

---

## 13.5 Video-like Replay Timeline

### Description

Timeline adalah fitur utama produk. Developer dapat memutar ulang sesi agent seperti video.

### Capabilities

* Play / pause.
* Scrub timeline.
* Jump ke timestamp tertentu.
* Event markers.
* Chapter strip.
* Playback speed.
* Marker click navigation.
* Current event sync dengan viewport.

### Timeline Markers

Marker dapat berupa:

* Prompt received.
* First edit.
* Dependency installed.
* Test failed.
* Test passed.
* File changed.
* Auth/security file changed.
* Config changed.
* Large diff.
* Repeated error.
* Needs Review.
* Session completed.

### Acceptance Criteria

* Timeline menampilkan durasi session.
* User bisa drag ke timestamp tertentu.
* Main replay viewport berubah sesuai timestamp.
* Marker bisa diklik dan mengubah current timestamp.
* Chapter bisa diklik dan membawa user ke awal chapter.

### 13.5.1 Loop/Retry Detection Visualization

#### Description

Timeline tidak hanya menampilkan dot markers. Timeline juga menampilkan **colored segments** yang menunjukkan progress state agent secara visual. Fitur ini membuat masalah "agent stuck in a loop" langsung terlihat tanpa harus membaca event satu per satu.

#### Colored Segments

Timeline track dibagi menjadi segments berwarna berdasarkan analisis progress:

* **Hijau (Forward Progress)** — Agent membuat kemajuan: file baru diedit, test baru dijalankan, command berbeda dieksekusi, test yang sebelumnya gagal menjadi pass.
* **Kuning (Retry/Attempt)** — Agent mengerjakan area yang sama dengan command mirip, progress belum jelas: file yang sama diedit ulang, command serupa dijalankan, output belum berubah signifikan.
* **Merah (Stuck/Loop)** — Agent menunjukkan tanda stuck: failure berulang dengan error output yang sama, command identik dijalankan berulang kali, test result tidak berubah setelah multiple edits.

#### Visual Rendering

* Colored bar segments langsung di timeline track (bukan hanya dot markers di atas timeline).
* Segments memiliki opacity gradient di edges untuk transisi smooth antar warna.
* Hover pada segment menampilkan tooltip: "Retry segment: agent ran similar commands 4x with same error output."
* Click pada colored segment → jump ke awal segment tersebut.

#### Detection Signals

Segment coloring menggunakan rule-based detection dari kombinasi:

* Command similarity (Levenshtein distance atau exact match).
* Touched-file overlap antar attempts.
* Error output similarity (hash comparison atau substring match).
* Test result changes (pass/fail state transitions).
* New file introductions vs repeated file edits.

#### Acceptance Criteria

* Timeline menampilkan colored segments (hijau/kuning/merah).
* Segments dihitung dari event patterns, bukan manual input.
* Hover pada segment menampilkan tooltip dengan penjelasan.
* Click segment membawa user ke timestamp awal segment.
* Minimal 1 non-green segment terdeteksi pada session yang memiliki retry/loop behavior.

---

## 13.6 Reconstructed Screen Replay

### Description

Fitur utama Looma. Satu viewport cinematic yang merekonstruksi "layar" agent selama bekerja. Viewport ini berganti mode secara otomatis berdasarkan event type pada current timestamp, memberikan pengalaman seperti menonton screen recording dari AI agent.

Ini bukan kumpulan panel terpisah. Ini adalah satu area viewport yang secara smooth bertransisi antar mode sesuai aktivitas agent.

### Viewport Modes

#### 1. Terminal Mode

* Renderer: xterm.js.
* Command muncul dengan typing animation (karakter per karakter).
* Output streaming muncul line-by-line.
* Prompt, command, dan output dibedakan secara visual.
* Triggered oleh: `terminal_command`, `terminal_output` events.

#### 2. Editor Mode

* Renderer: Monaco Editor atau CodeMirror.
* File dibuka dengan syntax highlighting sesuai bahasa.
* Cursor bergerak ke line target (animated).
* Text baru muncul character-by-character atau line-by-line.
* Changed lines di-highlight dengan background color.
* File path ditampilkan di breadcrumb atas viewport.
* Triggered oleh: `file_write`, `file_read`, `file_snapshot` events.

#### 3. Diff Mode

* Renderer: react-diff-viewer atau diff2html.
* Side-by-side atau inline diff view.
* Additions (hijau) dan deletions (merah) jelas terlihat.
* File path dan stats (+N/-N) ditampilkan di header.
* Triggered oleh: `file_diff` events.

#### 4. Test Result Mode

* Formatted test output.
* Pass/fail highlighting (hijau/merah).
* Test name, duration, dan error message terstruktur.
* Summary bar: X passed, Y failed, Z skipped.
* Triggered oleh: `test_result`, `build_result`, `lint_result` events.

#### 5. Browser Mode (Future)

* Screenshot atau iframe view.
* Placeholder untuk MVP — menampilkan static screenshot jika `browser_snapshot` event tersedia.
* Triggered oleh: `browser_snapshot` events.

### Transition Behavior

* **Crossfade** antar mode menggunakan framer-motion (200–300ms).
* **Subtle scale** transition: content scale dari 0.98 → 1.0 saat mode baru muncul.
* **Mode indicator badge** di pojok kanan atas viewport berubah sesuai mode aktif.
* **File path breadcrumb** muncul saat di Editor atau Diff mode.
* **No jarring cuts** — setiap pergantian mode harus terasa smooth dan intentional.

### Animation Details

* Typing speed di Terminal Mode: default 30ms per karakter, adjustable dengan playback speed.
* Cursor movement di Editor Mode: smooth scroll ke target line (200ms).
* Output streaming: default 50ms per line, adjustable.
* Semua animation speed dipengaruhi oleh playback speed multiplier (0.5x, 1x, 1.5x, 2x, 4x).

### MVP Priority

1. Terminal Mode (typing animation + output streaming).
2. Editor Mode (file display + line highlight + cursor positioning).
3. Diff Mode (side-by-side diff).
4. Mode transitions (framer-motion crossfade).
5. Test Result Mode (formatted output).

Browser Mode deferred ke Could Have.

### Acceptance Criteria

* Viewport berganti mode otomatis berdasarkan event type pada current timestamp.
* Terminal events menampilkan animated command typing dan output streaming.
* Editor events menampilkan file dengan cursor positioned di lokasi perubahan.
* Diff events menampilkan side-by-side diff dengan additions/deletions highlighted.
* Test events menampilkan formatted pass/fail output.
* Transisi antar mode menggunakan animasi smooth (bukan instant cut).
* Mode indicator badge menunjukkan mode aktif.
* Playback speed mempengaruhi kecepatan semua animasi.
* File path breadcrumb muncul di Editor dan Diff mode.

---

## 13.7 Needs Review Markers

### Description

Needs Review adalah hero feature Looma.

Fitur ini membantu developer menjawab:

> “Bagian mana yang perlu saya cek dulu?”

Needs Review bukan berarti agent salah. Needs Review berarti event tersebut cukup penting untuk dilihat manusia.

### Marker Examples

```text
First file edit
Dependency installed
Test failed
Tests passed after failure
Large file change
Auth/security file changed
Config file changed
Environment file touched
Repeated command
Repeated error
Repeated attempt
Possible loop
Loop detected (N iterations)
Retry with no progress
Same outcome after retries
Destructive command
Needs Review
```

### Needs Review Triggers

Event dapat diberi Needs Review jika:

* dependency baru diinstall,
* file auth/security/config/env diubah,
* diff cukup besar,
* test gagal,
* test gagal lalu pass,
* command berulang,
* error berulang,
* agent mencoba memperbaiki area/problem yang sama beberapa kali tetapi output atau error tetap sama,
* command, touched files, dan test result menunjukkan pola retry dengan progress rendah,
* loop terdeteksi (N iterasi dengan sinyal yang sama),
* retry tanpa progress terukur (output identik setelah multiple attempts),
* migration/database schema diubah,
* public API contract diubah,
* command berisiko dijalankan,
* file sensitive disentuh.

### Acceptance Criteria

* Sistem menghasilkan minimal 3 markers per meaningful session.
* Marker muncul di timeline.
* Marker muncul di sidebar/list.
* Klik marker membawa user ke timestamp terkait.
* Marker memiliki alasan singkat.
* Marker bersifat deskriptif, bukan evaluatif.
* Marker loop/retry menjelaskan sinyal yang terdeteksi, misalnya command mirip, file sama, error sama, atau test result tidak berubah.
* Loop/retry markers link ke colored timeline segment yang sesuai.
* Marker reason untuk loop includes iteration count dan apa yang tetap sama.

---

## 13.8 Lightweight Chapters

### Description

lens-agent membuat chapter ringan berdasarkan fase aktivitas agent.

### Example Chapters

```text
00:00–02:10 Understanding task
02:11–05:40 Exploring files
05:41–09:30 Editing implementation
09:31–12:00 Running tests
12:01–15:20 Fixing errors
15:21–18:42 Final verification
```

### Implementation Approach

Kombinasi:

* rule-based phase detection,
* small LLM untuk title dan summary.

### Acceptance Criteria

* Session selesai menghasilkan minimal 3 chapters.
* Chapter punya start time dan end time.
* Chapter punya title yang natural.
* Klik chapter membawa user ke awal chapter.

---

## 13.9 AI Session Notes

### Description

Panel kecil di bagian bawah replay page yang menjelaskan session secara singkat.

### Tone

Deskriptif, netral, dan tidak menghakimi.

### Example

```text
The agent implemented JWT authentication, installed jose, edited auth utilities, added middleware, and verified the auth tests. Review src/lib/auth.ts and middleware.ts because they contain the main implementation changes.
```

Possible loop example:

```text
The agent attempted to fix the same failing auth test across 4 iterations, touching similar files and rerunning similar commands, but the error output remained unchanged. Review that segment first because it may explain where the agent got stuck.
```

### Acceptance Criteria

* Notes dibuat otomatis saat session selesai.
* Notes maksimal 3–5 bullet atau 1 paragraf pendek.
* Notes menyebut file/momen penting.
* Notes menjelaskan Needs Review markers yang penting, termasuk possible loop atau repeated attempt jika terdeteksi.
* Notes tidak memberi verdict approval/rejection.

---

## 13.10 Agent Behavior Map

### Description

Replay page menampilkan behavior map compact untuk memberi overview dalam 10 detik.

### Metrics

* Read: jumlah file_read.
* Edit: jumlah file_write/file_diff.
* Run: jumlah terminal_command.
* Fail: jumlah failed tests/errors.
* Fix: jumlah edit setelah failure.
* Verify: jumlah passed tests/final checks.
* Review: jumlah Needs Review markers.

### Acceptance Criteria

* Behavior map tampil di replay header atau sidebar.
* Angka dihitung dari event stream.
* Klik item dapat memfilter event terkait.

---

## 13.11 Privacy and Redaction

### Description

Looma merekam terminal output, file diff, env/config, dan logs. Karena itu, privacy/redaction perlu masuk sejak MVP.

### MVP Redaction Rules

Sistem harus mencoba melakukan redaction untuk:

* API keys,
* access tokens,
* refresh tokens,
* JWT,
* private keys,
* passwords,
* `.env` values,
* secrets,
* credentials,
* database URLs.

### Sensitive Event Detection

Event diberi flag sensitive jika terkait:

* `.env`,
* `secret`,
* `token`,
* `key`,
* `credential`,
* `auth`,
* `security`,
* `config`,
* private key block,
* database connection string.

### Storage Approach

Idealnya sistem menyimpan:

* `raw_payload_json` untuk internal/debug/local mode,
* `redacted_payload_json` untuk replay display,
* `sensitivity` level,
* `redaction_applied` boolean.

Untuk MVP hackathon, cukup gunakan redacted payload sebagai default display.

### Acceptance Criteria

* Token-like strings tidak tampil mentah di replay.
* Event sensitive diberi badge.
* Replay page memberi warning jika ada sensitive files.
* User dapat melihat bahwa redaction diterapkan.

---

## 13.12 Visual Polish and Real-time Feedback

### Description

Looma harus terasa hidup dan cinematic. Visual polish bukan nice-to-have — ini adalah bagian dari product identity yang membedakan Looma dari generic developer tools.

### Dark Mode Default

* Dark mode adalah theme default (Tailwind `dark` class pada root).
* Color palette: dark backgrounds (slate-900/950), accent colors untuk markers dan segments.
* Light mode tersedia sebagai opsi, tapi dark mode adalah first impression.

### Real-time Recording Indicator

Saat session berstatus `recording` (LIVE), UI menampilkan:

* **Red pulse dot** — animasi CSS/framer-motion yang berkedip setiap 1.5 detik.
* **"RECORDING" badge** — di header, berwarna merah dengan pulse animation.
* **Live event counter** — angka yang increment real-time setiap event baru masuk (e.g., "47 events").
* **Duration counter** — timer yang berjalan menunjukkan durasi recording.

### Smooth Animations

* **Viewport mode transitions** — framer-motion crossfade + scale (200–300ms).
* **Event list entry** — items baru animate in dengan fade + slide-up (150ms).
* **Marker highlight** — pulse animation singkat (300ms) saat marker di-navigate.
* **Timeline scrubbing** — smooth interpolation saat drag, bukan jump.
* **Chapter transitions** — subtle background color shift saat masuk chapter baru.
* **Card hover states** — subtle scale (1.02) + shadow elevation pada session cards.

### Acceptance Criteria

* Dark mode merender sebagai default tanpa user action.
* Live session menampilkan animated recording indicator (red pulse + badge).
* Event counter update real-time saat recording aktif.
* Transisi antar viewport mode menggunakan animasi (bukan instant).
* Event list items animate saat muncul.
* Timeline scrubbing terasa smooth (no jank).

---

## 13.13 Aha Moment UX

### Description

Looma harus membuat user memahami value produk dalam waktu kurang dari 5 detik. Dua fitur utama memastikan ini terjadi.

### Pre-loaded Demo Session

Landing page (`/`) langsung menampilkan replay demo yang sedang berjalan:

* Saat user membuka landing page, reconstructed screen replay sudah auto-play.
* Demo session menunjukkan agent mengerjakan task nyata (e.g., "Implement JWT auth").
* User melihat terminal typing, editor cursor bergerak, mode switching — tanpa klik apapun.
* Zero friction: tidak perlu signup, tidak perlu klik play, langsung terlihat.

### "Jump to Interesting" Button

Tombol prominent di replay page yang langsung membawa user ke momen paling penting:

* Posisi: di area timeline, dekat play/pause controls.
* Label: "Jump to Interesting" atau "Show me what matters".
* Behavior: navigasi ke Needs Review marker pertama (atau marker dengan severity tertinggi).
* Setelah klik, viewport langsung menampilkan konteks marker tersebut (diff, terminal, dll).
* Jika sudah di marker terakhir, button disabled atau cycle ke marker pertama.

### Time-to-Value Target

* Landing page: user paham apa yang Looma lakukan dalam < 5 detik.
* Replay page: user menemukan momen penting pertama dalam < 10 detik (via "Jump to Interesting").
* Import flow: dari upload file ke replay ready dalam < 30 detik.

### Acceptance Criteria

* Landing page auto-plays demo replay session tanpa user interaction.
* Demo session loads dalam < 2 detik.
* "Jump to Interesting" button ada di replay page dan functional.
* Klik button membawa user ke Needs Review marker pertama.
* Viewport berubah sesuai konteks marker yang di-navigate.

---

## 14. lens-agent

## 14.1 Definition

**lens-agent** adalah agen AI internal Looma yang memproses session pasca-`record_stop` — mengubah raw event stream menjadi replay metadata (chapters, markers, notes, behavior summary) yang siap ditampilkan oleh UI.

### Goal

Mengubah raw autonomous-agent session event stream menjadi replay yang mudah dinavigasi manusia.

### Autonomous Task

Given a raw autonomous coding-agent session event stream, the lens-agent autonomously classifies events, creates lightweight chapters, surfaces review-worthy markers, generates concise session notes, and publishes replay metadata for the UI. Agent beroperasi dalam **autonomous loop** — memilih tool mana yang dipanggil berikutnya berdasarkan reasoning, dan dapat iterate sampai output dianggap lengkap.

### Agent Capabilities

* Reasoning: memahami urutan session, konteks event, dan memutuskan langkah berikutnya.
* Decision-making: memilih tool mana yang dipanggil secara dinamis berdasarkan state saat ini.
* Tool usage: memanggil internal tools secara otonom untuk analisis, deteksi, generasi, dan publikasi.
* Autonomous loop: iterate sampai self-evaluation menunjukkan output lengkap dan berkualitas.
* Self-evaluation: mengecek kelengkapan output sendiri dan loop back jika ada yang kurang.
* Summarization: membuat notes dan chapter title.
* Navigation intelligence: membantu manusia menemukan momen penting.
* Visible reasoning: setiap keputusan di-log sebagai reasoning trace yang dapat ditampilkan di UI.

### Important Constraint

lens-agent tidak memberi keputusan benar/salah terhadap pekerjaan coding agent. Agent hanya membantu navigasi replay.

### Cost Constraint

Agent harus cost-effective karena berjalan di samping agen utama. Biaya per session harus negligible (~$0.001 atau kurang). Strategi:

* Gunakan model murah (GPT-4o-mini, Claude Haiku, atau Gemini Flash).
* Rule-based tools untuk heavy computation (0 token cost).
* LLM hanya untuk orchestration, text generation, dan self-evaluation.
* Event compression sebelum masuk LLM context.
* Max iterations dibatasi (maxSteps: 8).

---

## 14.2 Agent Architecture

### Framework

Vercel AI SDK (`ai` package) dengan `generateText()` + `tools` + `maxSteps` pattern.

Alasan pemilihan:

* TypeScript-native, integrates dengan Next.js stack yang sudah ada.
* Built-in autonomous loop via `maxSteps` parameter.
* Supports model murah (GPT-4o-mini, Claude Haiku, Gemini Flash).
* Minimal boilerplate (2 packages: `ai` + `@ai-sdk/openai`).

### Execution Model

```text
POST /api/sessions/[sessionId]/process
  │
  ├─ 1. Fetch events from Supabase
  ├─ 2. Compress events into summary (rule-based, 0 tokens)
  ├─ 3. generateText({ model, tools, maxSteps: 8 })
  │     │
  │     ├─ Agent reasons → calls analyze_event_patterns (rule-based)
  │     ├─ Agent reasons → calls detect_review_markers (rule-based)
  │     ├─ Agent reasons → calls generate_chapters (hybrid: rules + LLM titles)
  │     ├─ Agent reasons → calls calculate_behavior_summary (rule-based)
  │     ├─ Agent reasons → calls generate_session_notes (LLM)
  │     ├─ Agent reasons → calls evaluate_completeness (rule-based)
  │     │   └─ If incomplete → agent loops back to fill gaps
  │     └─ Agent reasons → calls publish_replay_metadata (DB write)
  │
  └─ 4. Return result with reasoning trace
```

Agent memilih tool order sendiri. Urutan di atas adalah typical flow, bukan hardcoded sequence. Agent dapat skip tools yang tidak relevan atau loop back jika self-evaluation menunjukkan output kurang lengkap.

### Event Compression Layer

Sebelum events masuk ke LLM context, raw events dikompresi menjadi structured summary:

* ≤50 events: semua dimasukkan ke timeline.
* 50–200 events: sampling dengan error events selalu preserved.
* >200 events: chunked into windows, summarized per window, first/last 10 events verbatim.

Ini memastikan LLM prompt selalu <2000 tokens event context, regardless session size.

### Reasoning Trace

Setiap keputusan agent (tool call + alasan) di-capture dan disimpan ke database. Reasoning trace berisi:

* Step number.
* Tool yang dipanggil.
* Alasan agent memilih tool tersebut (dari LLM text output sebelum tool call).
* Ringkasan hasil tool.
* Timestamp.

Reasoning trace disimpan di `replay_metadata` dan dapat ditampilkan di UI sebagai collapsible "Agent Reasoning" panel.

---

## 14.3 Agent Responsibilities

lens-agent melakukan:

1. Compress raw events into structured summaries (pre-LLM, rule-based).
2. Analyze event patterns (loops, retries, stuck periods, phases).
3. Detect Needs Review markers (rule-based triggers).
4. Generate lightweight chapters (rule-based phase detection + LLM titles).
5. Calculate behavior summary metrics (rule-based counting).
6. Generate concise session notes (LLM summarization).
7. Self-evaluate completeness (rule-based checklist).
8. Publish replay metadata to database.
9. Capture and store reasoning trace.

---

## 14.4 Agent Tools

Tools dipanggil secara **dinamis** oleh LLM — bukan sequential hardcoded. Agent memilih tool berikutnya berdasarkan reasoning tentang state saat ini.

```text
analyze_event_patterns()    — Rule-based: scan for loops, retries, phases, stuck periods
detect_review_markers()     — Rule-based: find review-worthy moments based on triggers
generate_chapters()         — Hybrid: rule-based phase detection + LLM title generation
calculate_behavior_summary() — Rule-based: count metrics (read/edit/run/fail/fix/verify)
generate_session_notes()    — LLM: summarize session in 3-5 bullets
evaluate_completeness()     — Rule-based: check what's been done, score 0-100, list gaps
publish_replay_metadata()   — DB write: save all results to Supabase tables
```

### Tool Cost Profile

| Tool | Method | Token Cost |
|------|--------|-----------|
| analyze_event_patterns | Rule-based | 0 |
| detect_review_markers | Rule-based | 0 |
| generate_chapters | Hybrid (rules + LLM titles) | ~200 |
| calculate_behavior_summary | Rule-based | 0 |
| generate_session_notes | LLM | ~400 |
| evaluate_completeness | Rule-based | 0 |
| publish_replay_metadata | DB write | 0 |
| Agent orchestration (system + decisions) | LLM | ~500 |
| **Total per session** | | **~1100 tokens** |

---

## 14.5 lens-agent Workflow

Agent beroperasi dalam autonomous loop, bukan fixed pipeline. Typical flow:

```text
1. [Pre-processing] Fetch session events from DB
2. [Pre-processing] Compress events into structured summary
3. [Agent Loop Start] generateText with tools and maxSteps: 8
4. Agent decides → analyze_event_patterns (understand session structure)
5. Agent decides → detect_review_markers (find important moments)
6. Agent decides → generate_chapters (create phase structure)
7. Agent decides → calculate_behavior_summary (compute metrics)
8. Agent decides → generate_session_notes (write human summary)
9. Agent decides → evaluate_completeness (self-check: score >= 80?)
   └─ If score < 80 → agent loops back to fill gaps
10. Agent decides → publish_replay_metadata (save to DB)
11. [Post-processing] Update session status to replay_ready
```

### Edge Case Handling

* **< 5 events**: Minimal output (1 chapter, basic notes, no loop detection possible).
* **> 200 events**: Chunked compression, full rule-based analysis on all events.
* **All green (no failures)**: Informational markers only, clean session notes.
* **All stuck (only failures)**: Heavy markers, single "Repeated attempts" chapter.
* **0 events**: Skip agent entirely, set replay_ready with empty metadata.

---

## 14.6 Rule-based Marker Detection

```text
if event.type == "file_write" and first_write:
  marker = "First edit"

if event.type == "terminal_command" and command contains install/add:
  marker = "Dependency installed"

if event.type == "test_result" and status == "failed":
  marker = "Test failed"

if event.type == "test_result" and previous_failed and status == "passed":
  marker = "Tests passed after failure"

if diff.additions + diff.deletions > threshold:
  marker = "Large diff"
  needs_review = true

if file path contains auth/security/config/env:
  marker = "Needs Review"
  reason = "Sensitive implementation area changed"

if command repeated more than threshold:
  marker = "Repeated command"

if error pattern repeated:
  marker = "Repeated error"

if similar commands + same touched files + unchanged error/output across attempts:
  marker = "Possible loop"
  reason = "Agent retried the same problem with low observable progress"

if same test keeps failing after multiple edits:
  marker = "Same outcome after retries"
  reason = "Failure output stayed materially similar after repeated attempts"

if command contains rm -rf or destructive pattern:
  marker = "Destructive command"
  needs_review = true
```

---

## 14.7 LLM Usage

LLM digunakan untuk:

* **Agent orchestration**: memilih tool berikutnya berdasarkan reasoning (~500 tokens).
* **Chapter titles dan summaries**: generate nama fase yang natural (~200 tokens).
* **Session notes**: rangkuman session 3-5 bullet (~400 tokens).
* **Human-readable marker reasons**: penjelasan singkat kenapa marker penting.

LLM tidak digunakan untuk:

* judge correctness,
* approve/reject code,
* deep code review,
* full raw log analysis,
* event classification (rule-based),
* marker detection (rule-based),
* behavior summary calculation (rule-based).

### Cost Control Rules

* Jangan kirim full raw logs ke LLM. Kirim compressed event summaries.
* Gunakan model murah: GPT-4o-mini (primary), Claude Haiku atau Gemini Flash (fallback).
* Max iterations: 8 steps per session.
* Temperature: 0.1 (consistent, low-verbosity output).
* Total cost target: ~1100 tokens per session (~$0.001).

---

## 15. User Flows

## Flow 1 — Start Recording

1. Developer berada di agent harness (Claude Code, Codex, dll).
2. Developer menjalankan `/record start` atau memanggil MCP tool `record_start`.
3. MCP server membuat session baru di Looma backend.
4. MCP server menulis session ID ke `~/.looma/active_session`.
5. UI menampilkan session sebagai `LIVE`.
6. Hooks mulai aktif — setiap tool call agent otomatis ter-capture.

---

## Flow 2 — Agent Works Autonomously

1. Coding agent menerima task dari user.
2. Agent membaca file, menjalankan tool, mengedit file, menjalankan command, dan menjalankan test.
3. Hooks (`PostToolCall`) otomatis mengirim setiap action sebagai event ke Looma API.
4. Looma menyimpan event dengan redaction.
5. UI live event stream update secara real-time via Supabase Realtime.
6. User dapat melakukan follow-up prompts — recording tetap berjalan.
7. Semua events dari semua tasks dalam session terus direkam sampai explicit stop.

---

## Flow 3 — Session Completed

1. Developer menjalankan `/record stop` atau memanggil MCP tool `record_stop`.
2. MCP server menghapus `~/.looma/active_session`.
3. Session status berubah menjadi `processing`.
4. lens-agent berjalan (autonomous loop):
   * Agent memilih tools secara dinamis.
   * Agent menganalisis patterns, mendeteksi markers, generate chapters dan notes.
   * Agent self-evaluate dan iterate jika output belum lengkap.
   * Agent publish metadata ke database.
5. Session status berubah menjadi `replay_ready`.
6. Replay link siap dibuka.

---

## Flow 4 — Watch Full Replay

1. Developer membuka Replay Session Page.
2. Developer menonton replay melalui timeline.
3. Developer scrub ke timestamp tertentu.
4. Viewport berganti mode sesuai event: terminal mode, editor mode, atau diff mode.
5. Transisi antar mode smooth (crossfade animation).
6. Developer memahami proses kerja agent seperti menonton screen recording.

---

## Flow 5 — Review Important Moments First

1. Developer membuka completed replay.
2. Looma menampilkan top Needs Review markers di sidebar.
3. Developer klik "Jump to Interesting" button atau klik marker pertama.
4. Viewport lompat ke momen terkait dan berganti mode sesuai konteks (diff mode, terminal mode, dll).
5. Developer mereview momen penting tanpa membaca full raw logs.
6. Developer melihat colored timeline segments (merah = loop/stuck) untuk identifikasi masalah.
7. Developer dapat lanjut menonton full replay jika perlu.

---

## Flow 6 — Import Existing Transcript

1. Developer upload JSON/JSONL transcript dari session agent.
2. Looma menormalisasi event.
3. lens-agent membuat markers, chapters, dan notes.
4. Developer mendapat replay link.
5. Developer dapat membagikan replay artifact.

---

## Flow 7 — Dashboard Overview

1. User login ke Looma.
2. Dashboard menampilkan recent sessions (3-5 terbaru) dan activity chart.
3. User melihat quick actions: Start Recording, Import Transcript, View Demo.
4. User klik session card → navigasi ke replay page.
5. Atau user klik quick action → navigasi ke import page atau MCP setup instructions.

---

## 16. Information Architecture

### Page Structure

```text
Public Pages (No Auth):
  /                     Landing page (before/after, demo replay, CTA)
  /login                Login page
  /signup               Signup page

App Pages (Auth Required):
  /dashboard            Overview — recent sessions, activity chart, quick actions
  /sessions             Session list — card grid with preview thumbnails
  /replay/[sessionId]   Main replay experience
  /import               Upload JSON/JSONL transcript
```

### Page Descriptions

#### `/` — Landing Page (Public)

* Before/after narrative hero: split screen (raw log vs Looma replay).
* Pre-loaded demo session auto-playing (reconstructed screen replay).
* Product one-liner dan positioning statement.
* CTA: "Get Started" → signup, "View Demo" → scroll ke demo replay.
* Feature highlights: timeline, markers, chapters, AI notes.
* Footer: links, social.

#### `/login` — Login Page (Public)

* Email + password form.
* Link ke signup.
* OAuth buttons (Google — Should Have).

#### `/signup` — Signup Page (Public)

* Email + password registration form.
* Link ke login.
* OAuth buttons (Google — Should Have).

#### `/dashboard` — Dashboard (Auth Required)

* Welcome message + user info.
* **Recent sessions** — 3-5 session terbaru sebagai clickable cards (mini timeline thumbnail, name, status, duration).
* **Activity chart** — simple bar/line chart: sessions per hari atau per minggu.
* **Quick actions**:
  * Start Recording (shows MCP setup instructions).
  * Import Transcript (navigasi ke /import).
  * View Demo Session (navigasi ke sample replay).
* Empty state (new user): onboarding CTA, setup guide.

#### `/sessions` — Sessions List (Auth Required)

* **Card grid layout** dengan preview thumbnails.
* Setiap card menampilkan:
  * Mini timeline thumbnail (colored segments preview).
  * Session name.
  * Harness badge (Claude Code, Codex, dll).
  * Status badge: Recording (red pulse) / Processing (yellow) / Completed (green).
  * Duration.
  * Marker count.
  * Created date.
* **Filter**: dropdown by status (All / Recording / Processing / Completed).
* **Search**: by session name.
* **Sort**: by date (newest first default), by duration, by marker count.
* **Empty state**: CTA to start first recording or import transcript.
* Click card → navigasi ke `/replay/[sessionId]`.

#### `/replay/[sessionId]` — Replay Page (Auth Required, Shareable)

* Main replay experience (reconstructed screen replay).
* Full layout sesuai Section 17.
* **Shareable**: replay link bisa dibuka tanpa login dalam read-only mode (view only, no edit/delete).
* Breadcrumb: Sessions > [Session Name].

#### `/import` — Import Transcript (Auth Required)

* Upload area: drag & drop + file picker.
* Format support: JSON, JSONL.
* File validation dan preview (show normalized event count).
* Processing indicator setelah upload.
* Redirect ke replay page setelah processing selesai.

### Navigation

* **Top navbar**: Logo | Dashboard | Sessions | Import | [User Avatar + Dropdown (Settings, Logout)].
* **Breadcrumb** di replay page: Sessions > [Session Name].
* **Mobile**: hamburger menu untuk navbar items.
* Active page indicator di navbar.

---

## 16.1 Authentication

### Auth Provider

Supabase Auth dengan `@supabase/ssr` untuk Next.js server-side authentication.

### Auth Methods

* **MVP**: Email + Password.
* **Should Have**: Google OAuth.

### Route Protection

* **Protected routes**: `/dashboard`, `/sessions`, `/import`.
* **Public routes**: `/`, `/session/*`, `/auth/login`, `/auth/sign-up`.
* **Proxy**: Next.js proxy (`proxy.ts`) untuk refresh Supabase Auth session dan redirect unauthenticated users ke `/auth/login`.

### Shared Replay Access

* Replay links (`/replay/[sessionId]`) dapat diakses tanpa login dalam **read-only mode**.
* Read-only mode: bisa play/scrub/view, tidak bisa delete atau modify session.
* Jika user login dan memiliki session tersebut, tampilkan full controls.

### Session Ownership

* Setiap session memiliki `user_id` yang mereferensi `auth.users`.
* User hanya melihat sessions miliknya di `/dashboard` dan `/sessions`.
* API endpoints memfilter berdasarkan authenticated user.

### Acceptance Criteria

* User dapat signup dengan email + password.
* User dapat login dan diarahkan ke /dashboard.
* Unauthenticated user diredirect ke /login saat akses protected routes.
* Shared replay link bisa dibuka tanpa login (read-only).
* User hanya melihat sessions miliknya.
* Logout menghapus session dan redirect ke landing page.

---

## 17. UI Layout — Replay Session Page

### Header

* Looma logo (link ke /dashboard).
* Session title.
* Agent harness name badge.
* Status: Live (with recording indicator) / Completed.
* Duration (live counter saat recording, static saat completed).
* Share button (copy link, copy embed snippet).
* Sensitive warning badge if applicable.
* Recording indicator: red pulse dot + "RECORDING" badge (hanya saat LIVE).

### Behavior Map

* Read count.
* Edit count.
* Run count.
* Fail count.
* Fix count.
* Verify count.
* Review marker count.

### Timeline Area

* Play/pause button.
* Scrubber with smooth drag.
* Current time / total duration.
* **Colored segments** (hijau/kuning/merah) untuk loop/retry visualization.
* Event markers (dot indicators pada timeline).
* Chapter segments (labeled sections).
* Playback speed selector (0.5x, 1x, 1.5x, 2x, 4x).
* **"Jump to Interesting" button** — navigasi ke Needs Review marker pertama/berikutnya.

### Main Viewport

Satu area viewport besar yang menampilkan **reconstructed screen replay**:

* Terminal Mode (xterm.js, typing animation).
* Editor Mode (Monaco/CodeMirror, cursor movement).
* Diff Mode (side-by-side diff).
* Test Result Mode (formatted pass/fail output).
* Browser Mode (screenshot, future).
* **Mode indicator badge** di pojok kanan atas.
* **File path breadcrumb** saat di Editor/Diff mode.
* Smooth transitions antar mode (framer-motion crossfade).

### Sidebar (Collapsible)

Sidebar di sisi kanan yang bisa di-collapse untuk memberi lebih banyak ruang ke viewport:

* Session info (harness, workspace, source type).
* Needs Review marker list (clickable, dengan severity badge).
* Chapters list (clickable, dengan duration).
* Important files list.
* Important commands list.
* Event detail panel (saat event dipilih):
  * Payload summary.
  * Related file.
  * Related command.
  * Marker reason.
  * Sensitivity badge.

### Bottom Panel

* AI Session Notes.
* Needs Review summary.
* Redaction notice.

---

## 18. Data Model

## sessions

```text
id
user_id
name
harness
agent_name
status
started_at
ended_at
duration_ms
workspace_name
source_type
created_at
updated_at
```

`user_id` mereferensi `auth.users` dari Supabase Auth. Index pada `user_id` untuk filtering sessions per user.

### source_type examples

```text
mcp
slash_command
simulator
json_import
adapter
```

---

## events

```text
id
session_id
seq
timestamp
type
category
source
actor
workspace_path
related_file
related_command
payload_json
redacted_payload_json
display_text
sensitivity
redaction_applied
created_at
```

### sensitivity values

```text
none
low
medium
high
```

---

## markers

```text
id
session_id
event_id
seq
timestamp
label
category
reason
needs_review
severity
created_at
```

### severity values

```text
info
notice
important
sensitive
```

---

## chapters

```text
id
session_id
start_seq
end_seq
start_time_ms
end_time_ms
title
summary
created_at
```

---

## session_notes

```text
id
session_id
content
created_at
```

---

## behavior_summary

```text
id
session_id
read_count
edit_count
run_count
fail_count
fix_count
verify_count
review_count
important_files_json
important_commands_json
created_at
```

---

## replay_metadata

```text
id
session_id
chapters_json
markers_json
behavior_summary_json
notes
redaction_summary_json
created_at
updated_at
```

---

## 19. Normalized Agent Event Schema

Looma menggunakan normalized event schema agar session dari berbagai coding agents dapat direplay dalam UI yang sama.

> Catatan: `workspacePath` dan `relatedFile` di bawah merepresentasikan file pada **workspace agent yang sedang direkam** (apa pun strukturnya, termasuk `src/`). Layout kode **Looma sendiri** mengikuti §22 *Frontend Codebase Layout* — tanpa `src/`.

### Base Event

```json
{
  "seq": 12,
  "timestamp": "2026-05-14T10:42:31.120Z",
  "type": "file_diff",
  "category": "workspace",
  "source": "claude-code",
  "actor": "agent",
  "workspacePath": "/projects/next-app",
  "relatedFile": "src/lib/auth.ts",
  "relatedCommand": null,
  "payload": {},
  "displayText": "Edited src/lib/auth.ts",
  "sensitivity": "medium"
}
```

### Event Categories

```text
intent
workspace
execution
review
state
system
```

---

## 20. API Specification

## Create Session

```http
POST /api/sessions
```

Request:

```json
{
  "name": "Add user auth & session management",
  "harness": "claude-code",
  "agentName": "Claude Code",
  "workspaceName": "next-app",
  "sourceType": "mcp"
}
```

Response:

```json
{
  "sessionId": "sess_abc123",
  "status": "recording"
}
```

---

## Record Event

```http
POST /api/sessions/:sessionId/events
```

Request:

```json
{
  "type": "terminal_command",
  "timestamp": "2026-05-14T10:42:31.120Z",
  "payload": {
    "command": "pnpm test",
    "cwd": "/projects/next-app"
  }
}
```

Response:

```json
{
  "eventId": "evt_123",
  "seq": 18,
  "redactionApplied": false
}
```

---

## Stop Session

```http
POST /api/sessions/:sessionId/stop
```

Response:

```json
{
  "sessionId": "sess_abc123",
  "status": "processing"
}
```

---

## Process Replay

```http
POST /api/sessions/:sessionId/process
```

Response:

```json
{
  "sessionId": "sess_abc123",
  "status": "replay_ready"
}
```

---

## Get Replay

```http
GET /api/sessions/:sessionId/replay
```

Response:

```json
{
  "session": {},
  "events": [],
  "markers": [],
  "chapters": [],
  "behaviorSummary": {},
  "notes": "...",
  "redactionSummary": {}
}
```

---

## Import Transcript

```http
POST /api/import
```

Request:

```json
{
  "name": "Imported Claude Code Session",
  "sourceType": "json_import",
  "harness": "claude-code",
  "transcript": []
}
```

Response:

```json
{
  "sessionId": "sess_imported_123",
  "normalizedEventCount": 42,
  "status": "processing"
}
```

---

## 21. MCP Tool Specification

## record_start

Starts a recording session.

Input:

```json
{
  "name": "Add user auth & session management",
  "harness": "claude-code",
  "workspaceName": "next-app"
}
```

Output:

```json
{
  "sessionId": "sess_abc123",
  "status": "recording"
}
```

---

## record_event

Records a normalized or raw event.

Input:

```json
{
  "sessionId": "sess_abc123",
  "type": "file_diff",
  "payload": {
    "file": "src/lib/auth.ts",
    "additions": 68,
    "deletions": 3,
    "diff": "..."
  }
}
```

---

## record_snapshot

Records a file or browser snapshot.

Input:

```json
{
  "sessionId": "sess_abc123",
  "type": "file_snapshot",
  "payload": {
    "file": "src/lib/auth.ts",
    "content": "..."
  }
}
```

---

## record_checkpoint

Records a logical checkpoint.

Input:

```json
{
  "sessionId": "sess_abc123",
  "label": "Before auth middleware changes",
  "payload": {}
}
```

---

## record_stop

Stops recording and triggers replay processing.

Input:

```json
{
  "sessionId": "sess_abc123"
}
```

---

## get_replay_link

Returns the replay link.

Input:

```json
{
  "sessionId": "sess_abc123"
}
```

Output:

```json
{
  "url": "https://looma.app/replay/sess_abc123"
}
```

---

## 22. Technical Stack

## Frontend

```text
Next.js App Router
React
TypeScript
Tailwind CSS
shadcn/ui
Lucide React
framer-motion
Monaco Editor or CodeMirror
xterm.js
react-diff-viewer or diff2html
```

framer-motion digunakan untuk: viewport mode transitions, event list animations, recording indicator pulse, marker highlight animations, timeline scrubbing smoothness, card hover states.

### Frontend Codebase Layout

Looma adalah monorepo Bun. UI utama berada di `apps/web/` (package `@looma/web`) dengan **arsitektur feature-based Bulletproof React**, **tanpa folder `src/`**. Alias impor `@/` mengarah ke root `apps/web`.

```text
apps/web/
├── app/         # Next.js App Router (route, layout, route handler)
├── components/  # UI bersama (presentational, termasuk components/ui/* shadcn)
├── features/    # modul fitur per domain (api/, components/, hooks/, types/, utils/)
├── providers/   # client provider (TanStack Query, theme, dll)
├── config/      # konstanta + env validation (Zod)
├── hooks/       # hooks bersama lintas feature
├── lib/         # wrapper library pihak ketiga (Supabase, helper API)
├── stores/      # client state global (Zustand/Jotai)
├── types/       # tipe TypeScript bersama
├── utils/       # fungsi murni bersama
├── assets/      # asset yang di-bundle (SVG-as-component, font lokal)
├── testing/     # util tes, mock factories, MSW handlers
└── public/      # asset statis URL
```

Aturan utama:

* Alur impor satu arah: `shared → features → app`.
* **Tidak ada impor silang antar-feature.** `features/A` dilarang mengimpor dari `features/B`; promosikan kode bersama ke folder shared.
* Komposisi feature dilakukan di route segment `app/`.
* `packages/shared` (`@looma/shared`) tetap shared workspace di luar boundary `features/`.

Konvensi rinci, ringkasan aturan performa Vercel, dan checklist PR berada di [`AGENTS.md`](../AGENTS.md) di root repo.

## Backend

```text
Next.js Route Handlers
TypeScript
Zod
Supabase JS
@supabase/ssr
Vercel AI SDK (ai)
@ai-sdk/openai
```

## Database and Realtime

```text
Supabase Postgres
Supabase Auth
Supabase Realtime
Supabase Storage optional
```

## MCP Server + Hook Bridge

```text
TypeScript MCP SDK
Node.js runtime
Hook bridge script (PostToolCall → Looma API)
```

## AI Model

Use small hosted model for reliability and cost-effectiveness:

```text
GPT-4o mini (primary — cheapest, fastest)
Claude Haiku (fallback)
Gemini Flash (fallback)
```

### Agent Loop Configuration

```text
Framework: Vercel AI SDK generateText() + tools + maxSteps
Max steps: 8
Temperature: 0.1
Cost per session: ~1100 tokens (~$0.001)
```

For MVP, most marker detection should be rule-based. LLM is only used for agent orchestration (tool selection), lightweight naming, notes, and reasons.

Loop/retry detection should start rule-based and conservative. MVP signals can combine command similarity, touched-file overlap, repeated failure signatures, unchanged test output, and repeated edits after failure. The marker should avoid saying the agent is wrong; it should only say the segment deserves human review because progress appears low.

---

## 23. System Architecture

```text
Agent Harness
Claude Code / Codex / OpenCode / OpenClaw / Cline / Aider
        ↓
┌───────────────────────────────────────────┐
│  Hybrid Capture Layer                      │
│                                            │
│  MCP Tools (explicit)                      │
│    record_start / record_stop              │
│    → User controls session lifecycle       │
│                                            │
│  Hooks (implicit, automatic)               │
│    PostToolCall → hook-bridge → API        │
│    → Every agent action auto-captured      │
│                                            │
│  State: ~/.looma/active_session            │
└───────────────────────────────────────────┘
        ↓
Event Normalization Layer
        ↓
Event Ingestion API (real-time, deterministic)
        ↓
Redaction Pipeline
        ↓
Supabase Postgres + Realtime → Frontend Live UI
        ↓ (after record_stop)
lens-agent (autonomous loop, Vercel AI SDK)
  ├─ Rule-based tools (patterns, markers, summary)
  ├─ LLM tools (chapters, notes)
  └─ Self-evaluation + reasoning trace
        ↓
Replay Metadata: chapters, markers, notes, behavior map, reasoning trace
        ↓
Next.js Replay Session Page
        ↓
Shareable Replay Artifact
```

---

## 24. MVP Scope

## Must Have

* Next.js app with dark mode default.
* Supabase database + Supabase Auth (email + password).
* Authentication: login, signup, route protection proxy.
* Dashboard page (recent sessions, activity chart, quick actions).
* Sessions page (card grid with preview, filter, search).
* Top navbar navigation.
* Create session API.
* Record event API.
* Stop session API.
* Replay API.
* Real MCP server (record_start, record_event, record_stop) functional with Claude Code.
* Hook bridge for automatic event capture (PostToolCall → Looma API).
* Active session file mechanism (~/.looma/active_session).
* Simulated `/record` trigger (fallback).
* Live event stream.
* Replay session page.
* Reconstructed screen replay (terminal mode + editor mode + diff mode).
* Mode transitions with animation (framer-motion crossfade).
* Timeline scrubber with smooth drag.
* Loop/retry colored timeline segments (hijau/kuning/merah).
* Marker list.
* Needs Review markers.
* Lightweight chapters.
* AI Session Notes.
* Behavior map.
* lens-agent with autonomous loop (Vercel AI SDK + generateText + tools + maxSteps).
* Agent dynamic tool calling (7 tools, agent picks order).
* Agent self-evaluation loop (evaluate_completeness).
* Agent reasoning trace captured and stored.
* Event compression layer (cost control).
* Import JSON/JSONL transcript.
* Basic redaction for secrets/tokens/env values.
* Share replay link.
* Pre-loaded demo session on landing page.
* "Jump to Interesting" button.
* Recording indicator (red pulse + event counter) for live sessions.

## Should Have

* Sample session generator.
* Demo seed data.
* Sensitive event badges.
* Playback speed selector (0.5x, 1x, 1.5x, 2x, 4x).
* OG meta tags for social sharing.
* Embed snippet (iframe code).
* Before/after comparison on landing page.
* Editor mode typing animation (character-by-character).
* Agent reasoning trace displayed in UI (collapsible panel).
* Auto-stop timeout (30 min no activity).
* Google OAuth.
* README with reproducible setup.
* Deployed demo on Vercel.

## Could Have

* Browser mode in viewport.
* Full typing animation speed matching real agent speed.
* Export replay JSON.
* Codex/OpenCode adapter.
* Comment on replay timestamp.
* PR link integration.

## Won’t Have for Hackathon

* Full multi-agent integrations.
* Billing.
* Full audit compliance.
* AI judge/reviewer.
* Full restore checkpoint.
* Enterprise local-first mode.
* Deep static analysis.
* Real-time collaborative commenting.
* Pull request automation penuh.

---

## 25. Demo Plan — 2 Minutes

### 0:00–0:15 — Before/After Hook

Show split screen:

* **Left**: raw terminal log scrolling — 500+ lines, monospace, no structure, overwhelming.
* **Right**: Looma replay — colored timeline, chapters, markers, reconstructed screen replay.

Narration:

> “This is what reviewing an AI coding agent looks like today... and this is Looma.”

### 0:15–0:35 — Real MCP Integration

Show Claude Code with Looma MCP server configured:

* Agent receives task: “Implement JWT auth with refresh token.”
* Agent calls `record_start` via MCP → session goes LIVE in Looma UI.
* Recording indicator appears: red pulse dot, “RECORDING” badge, event counter starts.
* Show real MCP tool calls flowing from agent to Looma.

### 0:35–1:00 — Reconstructed Screen Replay (Live)

Show the single viewport switching modes in real-time:

* **Terminal mode**: command typing animation, output streaming.
* **Editor mode**: cursor moves to file, code appears character-by-character.
* **Back to terminal**: test running, output streaming.
* Mode transitions smooth (crossfade).
* Live event counter incrementing (e.g., “12 events... 13... 14...”).

### 1:00–1:25 — Completed Replay + Loop Detection

Session completes, replay processes:

* Show colored timeline: green segments (progress), yellow segment (retry), red segment (agent stuck).
* Show auto-generated chapters: “Understanding task”, “Implementing auth”, “Fixing test failures”, “Final verification”.
* Show behavior map: Read 8, Edit 5, Run 12, Fail 3, Fix 3, Verify 2, Review 4.

### 1:25–1:45 — “Jump to Interesting” + Review Navigation

* Click “Jump to Interesting” button.
* Viewport jumps to first Needs Review marker (e.g., “Dependency installed: jose”).
* Click next marker: “Auth file changed: src/lib/auth.ts” — viewport switches to diff mode.
* Click next marker: “Loop detected (3 iterations)” — viewport shows red timeline segment.
* Each click: smooth transition, viewport shows relevant context immediately.

### 1:45–2:00 — Share + Close

* Click share button → show OG preview (how it looks in Slack/Twitter).
* Show embed snippet copy.
* Close with:

> “Every agent run becomes reviewable, shareable, and cinematic. Looma — the Loom for autonomous coding agents.”

---

## 26. Pitch Deck Structure — 5 Slides

## Slide 1 — Problem

**Visual: Before/After split screen.**

* Left: raw 500-line terminal log — monospace, no structure, overwhelming.
* Right: Looma replay — colored timeline, chapters, markers, reconstructed screen.

Message: Autonomous coding agents work independently, but developers cannot easily inspect what happened. Raw logs are unreadable. There's no "replay" button.

## Slide 2 — Solution

Looma records coding-agent sessions via MCP, `/record`, hooks, or transcript import, then turns them into cinematic replay artifacts with reconstructed screen replay, colored timeline, and AI-generated review markers.

## Slide 3 — Product Demo / Key UX

Show:

* reconstructed screen replay (terminal typing, editor cursor, mode switching),
* colored timeline (green/yellow/red segments),
* "Jump to Interesting" button,
* Needs Review markers,
* chapters,
* AI session notes,
* share + embed.

## Slide 4 — AI Agent Workflow / Architecture

Show:

```text
agent harness → recorder bridge → event normalization → redaction → lens-agent → replay artifact
```

## Slide 5 — Differentiation and Future

Differentiation:

* not LLM trace dashboard,
* not browser session replay,
* not code judge,
* coding-agent replay artifact.

Future:

* adapters,
* PR integration,
* local-first recorder,
* team review workflow,
* enterprise privacy mode.

---

## 27. Success Metrics

## Demo Success

* A session can be recorded from start to finish via real MCP integration.
* Hooks automatically capture agent events without agent needing to call record_event explicitly.
* At least 20 events are captured.
* Reconstructed screen replay switches modes (terminal/editor/diff) with smooth transitions.
* Timeline displays colored segments (green/yellow/red).
* At least 3 chapters are generated.
* At least 3 Needs Review markers are detected.
* AI Session Notes are generated.
* Behavior map is generated.
* lens-agent demonstrates autonomous loop (visible in reasoning trace).
* lens-agent calls tools dynamically (not fixed sequence).
* Reasoning trace is stored and can be displayed.
* Replay link can be opened and shared.
* JSON/JSONL transcript can be imported.
* "Jump to Interesting" button navigates to first marker.
* Recording indicator (red pulse + event counter) visible during live session.
* Landing page auto-plays demo session.

## Product Success

* Developer can identify top 3 important moments in under 30 seconds.
* Developer can jump from a Needs Review marker to relevant diff/terminal output in one click.
* Developer can understand the agent’s workflow without reading raw logs.
* Replay artifact can be shared and understood by another developer who did not run the original session.
* Sensitive data is redacted or clearly flagged before replay display.
* Developer can determine whether they need deeper review in under 1 minute.
* Replay feels cinematic — transitions are smooth, not jarring.
* Time-to-value on landing page is under 5 seconds.
* Loop/stuck segments are immediately visible on timeline without reading event details.

---

## 28. Implementation Plan — 12 Hours

## Hour 0–1: Setup + Auth + MCP Server ✅ DONE

* ~~Create GitHub repository (monorepo Bun: `apps/*` + `packages/*`).~~
* ~~Setup Next.js + Tailwind + shadcn/ui + framer-motion di `apps/web/` mengikuti layout Bulletproof (lihat §22 Frontend Codebase Layout) — tanpa folder `src/`.~~
* ~~Configure dark mode as default (Tailwind dark class).~~
* ~~Setup Supabase schema + Supabase Auth (email + password).~~
* ~~Create login/signup pages di `apps/web/app/auth/login` dan `apps/web/app/auth/sign-up`.~~
* ~~Setup Next.js proxy for route protection (`apps/web/proxy.ts`).~~
* ~~Create MCP server skeleton (record_start, record_event, record_stop) di `packages/mcp-server`.~~
* ~~Create hook bridge script (PostToolCall → Looma API) di `packages/hook-bridge`.~~
* ~~Define shared event schema + Zod types di `packages/shared` (`@looma/shared`).~~

## Hour 1–3: Backend + App Pages Shell ✅ DONE

* ~~Create session API route handler di `apps/web/app/api/sessions/` (with user_id).~~
* ~~Create event ingestion API.~~
* ~~Create stop session API.~~
* ~~Create replay API.~~
* ~~Create import transcript API (enhanced: multi-event JSON array parsing with redaction).~~
* ~~Add `GET /api/sessions` — list sessions with filtering (status, search), pagination (limit/offset), marker counts.~~
* ~~Add `GET /api/sessions/[sessionId]` — single session detail with event/marker counts.~~
* ~~MCP server fully functional with Claude Code.~~
* ~~Hook bridge functional (reads ~/.looma/active_session, sends events).~~
* ~~Add Zod schemas + sample event JSON di `@looma/shared` atau `apps/web/config/`.~~
* ~~Install TanStack Query (`@tanstack/react-query`) + QueryProvider di `providers/query-provider.tsx`.~~
* ~~Shared types di `types/session.ts` (SessionCard, GetSessionsParams, GetSessionsResponse).~~
* ~~Install shadcn components: badge, select, skeleton, separator, dropdown-menu.~~
* ~~Build top navbar component dengan active route indicator + mobile menu (`features/app-shell/components/nav-links.tsx`).~~
* ~~Build shared `components/session-card.tsx` (presentational, status badges, duration, markers).~~
* ~~Build Dashboard page → komposisi di `apps/web/app/dashboard/page.tsx`, komponen domain di `apps/web/features/dashboard/components/` (stats, recent sessions, activity chart, quick actions).~~
* ~~Build Sessions page → `apps/web/app/sessions/page.tsx` + `apps/web/features/sessions/` (list, filters, empty state).~~
* ~~Build Import page → functional form di `features/import/components/import-form.tsx` (file upload, paste, submit, redirect).~~

## Hour 3–6: Reconstructed Screen Replay UI

Komponen replay tinggal di `apps/web/features/replay/` (komponen domain) dan `apps/web/components/` (primitives bersama). Library berat (Monaco/CodeMirror, xterm.js, react-diff-viewer) dibungkus `next/dynamic` agar tidak masuk bundle awal — selaras Vercel `bundle-dynamic-imports`.

* Build single viewport component with mode switching.
* Terminal mode (xterm.js + typing animation).
* Editor mode (Monaco/CodeMirror + cursor positioning + line highlight).
* Diff mode (react-diff-viewer/diff2html).
* Mode transitions (framer-motion crossfade + scale).
* Mode indicator badge.
* Timeline component with colored segments (hijau/kuning/merah).
* Timeline scrubber with smooth drag.
* Recording indicator (red pulse + event counter + RECORDING badge).
* "Jump to Interesting" button.

## Hour 6–8: lens-agent (Agentic Implementation)

Tools dan orkestrator lens-agent tinggal di `apps/web/features/lens-agent/` (atau `apps/web/lib/lens-agent/` jika dianggap shared infrastructure). Route handler entry point: `apps/web/app/api/sessions/[sessionId]/process/route.ts`.

* Install Vercel AI SDK (`ai` + `@ai-sdk/openai`).
* Create AI provider config (GPT-4o-mini).
* Create event compressor (raw events → structured summary).
* Create rule-based tools:
  * analyze_event_patterns (loop/retry/phase detection).
  * detect_review_markers (Needs Review triggers).
  * calculate_behavior_summary (metrics counting).
  * evaluate_completeness (self-check).
* Create LLM-powered tools:
  * generate_chapters (phase detection + LLM titles).
  * generate_session_notes (LLM summarization).
* Create publish_replay_metadata tool (DB write).
* Create agent orchestrator (generateText + tools + maxSteps: 8).
* Create system prompt with decision framework.
* Capture reasoning trace from agent steps.
* Integrate with /api/sessions/[sessionId]/process route.
* Timeline segment coloring based on pattern detection results.
* Test with sample session data.

## Hour 8–9: Aha Moment + Landing Page

* Pre-loaded demo session on landing page (auto-play).
* Before/after comparison component (split screen).
* Landing page hero section.
* OG meta tags for replay pages.
* Embed snippet generation + copy button.
* Share button with copy link.

## Hour 9–10: Polish + Privacy

* Regex-based secret detection + redaction pipeline.
* Sensitive event badges.
* Animation polish (event list entry, marker highlight, card hovers).
* Dashboard/sessions card visual polish.
* Responsive layout adjustments.
* Loading/completed/empty states.

## Hour 10–11: Deploy + Docs

* Deploy to Vercel.
* Confirm Supabase env vars + auth config.
* Write README with reproducible setup.
* Add demo instructions.
* Add sample transcript file.
* Verify MCP server setup instructions.

## Hour 11–12: Demo Video + Pitch Deck

* Record 2-minute demo (new cinematic structure).
* Create 5-slide pitch deck (with before/after on Slide 1).
* Prepare Devpost submission.

---

## 29. Risks and Mitigations

## Risk: MCP integration takes too long

Mitigation:

* Provide simulated MCP bridge.
* Implement import JSON/JSONL transcript.
* Document MCP tool schema clearly.

## Risk: Replay UI too complex

Mitigation:

* Focus MVP on timeline + terminal + diff + marker list.
* Browser snapshot and advanced views are optional.

## Risk: AI output unreliable

Mitigation:

* Use rule-based detection for markers.
* Use LLM only for wording, notes, and chapter titles.
* Keep AI output descriptive, not evaluative.

## Risk: Product looks like generic observability

Mitigation:

* Emphasize coding-native replay.
* Show terminal/diff/test sync.
* Make Needs Review markers the hero feature.

## Risk: Product looks like browser session replay clone

Mitigation:

* Avoid browser replay language.
* Use “coding-agent replay artifact”.
* Demo agent-specific events.

## Risk: Sensitive data is exposed

Mitigation:

* Add MVP redaction.
* Show sensitive badges.
* Prefer redacted payload in UI.

## Risk: Too much scope

Mitigation:

* Keep MVP to one replay page.
* Skip evaluator, approval, billing, team workflow, and full analytics.

## Risk: Reconstructed screen replay animation too complex for 12 hours

Mitigation:

* Terminal mode is MVP priority (xterm.js is well-documented and battle-tested).
* Editor mode can start with highlight-only (no character animation) and upgrade later.
* Transitions can be simple opacity fade initially, refined after core features work.
* framer-motion handles most animation complexity declaratively.
* Browser mode explicitly deferred to Could Have.

## Risk: Authentication adds complexity to 12-hour timeline

Mitigation:

* Supabase Auth is drop-in with Next.js (well-documented integration).
* Use `@supabase/ssr` for server-side auth — minimal boilerplate.
* Minimal UI: login + signup pages only (no profile, no settings).
* OAuth deferred to Should Have.
* Shared replay links work without auth (read-only mode).

---

## 30. Future Roadmap

## 30.1 Adapter Ecosystem

Add adapters for:

* Claude Code hooks.
* Codex CLI logs.
* OpenCode.
* OpenClaw.
* Cline.
* Aider transcripts.
* Cursor agent logs if accessible.

## 30.2 Local-first Recorder

* Run recorder locally.
* Redact secrets before upload.
* Optional cloud replay sharing.
* Local-only mode for sensitive repos.

## 30.3 Team Review Workflow

* Comment on replay timestamp.
* Assign marker to reviewer.
* Share replay in Slack/Discord.
* Mention teammates on marker.

## 30.4 Replay-to-PR Connection

* Link session replay to GitHub branch.
* Link replay to pull request.
* Show which replay events created which diff hunks.
* Add replay link in PR description.

## 30.5 Privacy-aware Enterprise Mode

* Local storage.
* Configurable redaction rules.
* Workspace allow/deny lists.
* Audit log.
* Access control.
* Retention policies.

## 30.6 Smarter lens-agent

* Better phase detection.
* Error recovery detection.
* Repeated failure clustering.
* Important file ranking.
* Session comparison across multiple agent runs.

---

## 31. Final Product Definition

**Looma is a replay-native review layer for autonomous coding agents.**

It is triggered via MCP, `/record`, hooks, adapters, or transcript import. It captures coding-agent activity, normalizes events, applies basic redaction, and produces a compact replay artifact with timeline, terminal output, diffs, test results, chapters, behavior map, AI session notes, and Needs Review markers.

Looma does not judge whether the agent was correct. It helps developers quickly understand what happened, where the important changes occurred, and what should be reviewed first.

Final positioning:

> **Looma is the Loom for autonomous coding agents: record a coding-agent run, then replay terminal commands, diffs, file changes, tests, and AI-generated review markers in one compact timeline.**
