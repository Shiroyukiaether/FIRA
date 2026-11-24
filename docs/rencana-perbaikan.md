# Rencana Perbaikan FIRA

Acuan: **IMK 05** (Pemodelan Tugas, Arsitektur Informasi, Wireframe) dan **IMK 06** (Desain Antarmuka Visual & Sistem Komponen).
Kondisi awal: hasil ekspor Figma → HTML (commit `a6d43c2`, branch `main` tidak diubah).

---

## 1. Temuan audit

Angka di bawah diambil langsung dari kode (`index.html`, `styles.css`, `app.js`).

### A. Struktur HTML & semantik (IMK 05 — "Anatomi Wireframe ke Web Semantik")

| # | Temuan | Prinsip yang dilanggar | Prioritas |
|---|--------|------------------------|-----------|
| A1 | Tidak ada `<header>`, `<nav>`, `<section>`, `<article>`, `<aside>`, `<footer>`. Hanya ada satu `<main>`. Semua elemen lain berupa `<div>`/`<span class="layer appearance-N">`. | Zona wireframe wajib punya padanan elemen semantik; penting untuk screen reader (WCAG). | Tinggi |
| A2 | Tidak ada satu pun heading `<h1>`–`<h3>`. Judul "Status peminjaman", "Kalender aktivitas" hanya `<span>` bertipografi besar. | Layer-cake pattern: mata melompat antar sub-heading `<h2>` (IMK 06). | Tinggi |
| A3 | 0 `<button>`, 0 `<a>`. Ada ±650 `<div role="button">`. Tombol, tab, dan link semua dibuat dari div. | Atom = tag HTML tunggal (`<button>`, `<a>`) — Atomic Design (IMK 06). | Tinggi |
| A4 | 0 `<form>`, `<input>`, `<label>`, `<select>`. Field seperti "Kontak (ID LINE / Nomor HP)" hanya teks; "Masukkan ID LINE atau nomor HP" adalah teks placeholder palsu. Pengguna tidak bisa mengetik. | Persistent top-aligned `<label>`, helper text, inline error onBlur; placeholder bukan pengganti label (IMK 06 hal. 30). | Tinggi |
| A5 | `aria-label` diisi ulang dari teks yang terlihat, termasuk simbol: `"Lihat Detail  →"`, `"Tutup ×"`, dan angka kalender `"9"` tanpa bulan/tahun. | Label harus bermakna tanpa konteks visual. | Sedang |
| A6 | 45 `<template id="view-194-322">`: nama dari ID node Figma, bukan nama layar. 7 layar + 38 overlay dalam satu file 534 KB / 4.352 baris. | Labeling system mengikuti model mental, bukan istilah internal (IA, IMK 05). Sulit dirawat. | Sedang |
| A7 | Kartu yang sama (mis. kartu status peminjaman) ditulis ulang utuh di tiap layar; satu baris kartu bisa 4.348 karakter. | Komponen reusable (Atomic Design). | Sedang |

### B. Tata letak & grid (IMK 06 — Grid 12 kolom, 8-point, breakpoint)

| # | Temuan | Prinsip | Prioritas |
|---|--------|---------|-----------|
| B1 | Semua elemen `position:absolute` dengan `left/top/width/height` piksel (±3.000 atribut `style`). Satu kanvas 1440×810 diskalakan JS (`app.js` `layout()`). | Grid 12 kolom + container 1200/1280 px; layout harus mengalir. | Tinggi |
| B2 | Tidak ada `@media` sama sekali; `body { overflow:hidden }`. Di HP (375 px) kanvas diperkecil ±0,26× → teks 16 px tampil ±4 px, tombol 48 px jadi ±12 px. | Breakpoint desktop ≥1200 / tablet 768–991 / mobile <576 (single-column stack). Target sentuh ≥48 px (Fitts). | Tinggi |
| B3 | 6.126 dari 11.399 nilai posisi/ukuran **bukan kelipatan 4**. Gap yang dipakai: 0, 6, 8, 12, 16, 18, 24. | 8-point system (4 untuk elemen mikro). | Sedang |
| B4 | Kotak teks ukuran tetap + `white-space: pre-wrap` → teks tumpah: "Baru" keluar dari tombol, "BEM" keluar dari badge, "revisi" terpotong (lihat screenshot). | Kotak harus mengikuti isi (`min-height`, padding), bukan tinggi kaku. | Tinggi (yang paling terlihat) |

### C. Tipografi (IMK 06 — Modular Type Scale, Major Third 1,25)

| # | Temuan | Prioritas |
|---|--------|-----------|
| C1 | 16 ukuran font berbeda: 12, 13, 14, 14.5, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 32, 64. Skala yang diajarkan cukup 5: **12 / 16 / 20 / 24 / 32** (line-height 16/24/28/32/40). | Sedang |
| C2 | NIM `255150200111024` memakai Inter biasa. Materi menyarankan monospace untuk NIM/kode/angka (atau minimal `font-variant-numeric: tabular-nums`). | Rendah |

### D. Warna & aksesibilitas (IMK 06 — 60-30-10, WCAG 2.2, Dual-Signifier)

| # | Temuan | Prioritas |
|---|--------|-----------|
| D1 | ±40 warna ditulis langsung sebagai `rgba(...)`; hanya **1** CSS custom property di seluruh file. Tidak ada design token primitive/semantic. | Tinggi |
| D2 | Kontras (dihitung dengan rumus WCAG): teks utama 14,8:1 ✅, teks muted `#51657b` 6,0:1 ✅, badge warning/danger/success 6,3–6,9:1 ✅. **Gagal:** border `#dce6ef` di atas putih 1,26:1 dan `#c4d3e2` 1,53:1 (batas input/komponen wajib ≥3:1). Putih di atas oranye `#ec831e` = 2,68:1 → gagal bila dipakai untuk teks (perlu dicek per pemakaian). | Tinggi |
| D3 | Warna aksi utama tidak tunggal: CTA oranye di hero, tombol putih, tab aktif garis oranye, focus ring biru `#298bd1`. 60-30-10 meminta satu accent khusus elemen interaktif utama. | Sedang |
| D4 | ✅ Sudah baik: badge status memakai warna + ikon + teks ("◷ Menunggu verifikasi BEM", "! Perlu revisi"), kalender memakai warna + ikon. Pertahankan, tapi ganti glyph Unicode (`◷ → ✓ ↗ ←`, 92 kemunculan) dengan ikon SVG agar konsisten antar perangkat. | Rendah |

### E. Status komponen & micro-interaction (IMK 06 — Finite State Machine, 6 status)

| # | Temuan | Prioritas |
|---|--------|-----------|
| E1 | `:hover` = 0, `:active` = 0, `disabled`/`not-allowed` = 0, `transition` = 0. Hanya ada `:focus-visible` (outline 3 px, offset **−3 px** — masuk ke dalam, bisa tertutup isi). Materi: ring 2 px, offset +2 px. | Tinggi |
| E2 | Tidak ada state Loading ("Mengirim…") saat mengirim pengajuan; tidak ada pencegahan klik ganda. | Sedang |
| E3 | Tidak ada inline error / helper per field (karena field-nya tidak nyata, lihat A4). | Tinggi |
| E4 | Dialog dibangun manual dari `div`; Esc dan focus-trap sudah ada di `app.js` (bagus). `<dialog>` bawaan browser memberi ini gratis. | Rendah |

### F. Arsitektur informasi & alur (IMK 05)

| # | Temuan | Prioritas |
|---|--------|-----------|
| F1 | 7 layar inti (Login, Dashboard, Prosedur, Pilihan Fasilitas, Ruangan, Peralatan, Publikasi), materi membatasi **5 layar inti**. Ruangan/Peralatan/Publikasi bisa jadi satu layar "Ajukan" dengan segmented control (3 opsi ≤ 5 → segmented, hukum Hick). **Diputuskan:** frame 6 & 7 adalah status tab dari Layar 4, digabung ke `pinjam.html` → 5 layar inti. | Selesai |
| F2 | Navigasi global sudah 3 item & kedalaman ≤2 level ✅. | — |
| F3 | Dashboard Z-pattern sudah masuk akal (logo kiri atas, profil kanan atas, CTA di hero) ✅. | — |

---

## 2. Keputusan pendekatan

**Bangun ulang dengan tangan, layar per layar, memakai ekspor Figma sebagai referensi visual** — bukan menambal hasil ekspor.

Alasan: masalah A1–A4 dan B1–B2 ada di *setiap* elemen. Menambal 650 `div role="button"` dan 3.000 `style` absolut lebih lama daripada menulis ulang, dan kamu tidak belajar pola yang benar. Hasil ekspor dipindah ke `_figma-export/` dan tetap bisa dibuka untuk dibandingkan.

Tanpa framework dan tanpa build tool: HTML + CSS + JS biasa, sesuai tujuan belajar. Ikon memakai set SVG yang sudah ada (mis. [Lucide](https://lucide.dev), lisensi ISC) agar tidak menggambar ikon sendiri.

### Struktur target

```
FIRA/
├── index.html            # Login (Layar 1)
├── dashboard.html        # Layar 2
├── prosedur.html         # Layar 3
├── pinjam.html           # Layar 4: tab Ruangan / Peralatan / Publikasi (frame Figma 4, 6, 7)
├── ajukan-ruangan.html   # Layar 5: form lanjutan ruangan
├── css/
│   ├── tokens.css        # design tokens: primitive + semantic
│   ├── base.css          # reset, tipografi, focus ring
│   ├── layout.css        # container, grid 12 kolom, breakpoint
│   └── components.css    # button, badge, field, card, dialog, tabs…
├── js/
│   ├── dialog.js         # buka/tutup <dialog>
│   └── form.js           # validasi onBlur, disabled, loading
├── assets/               # avatar.png, InterVariable.woff2, icons/
├── _figma-export/        # file ekspor lama, hanya referensi
└── docs/rencana-perbaikan.md
```

Multi-halaman (satu file HTML per layar) dipilih karena paling mudah dipahami pemula. Header dan nav memang tersalin di tiap file — itu wajar untuk situs statis kecil.

---

## 3. Tahapan kerja

Setiap tahap bisa dibuka di browser dan dicek sebelum lanjut. Bagian bertanda ✍️ adalah bagian yang kamu tulis sendiri; sisanya saya siapkan.

### Tahap 0 — Persiapan ✅
- Pindahkan `index.html`, `styles.css`, `app.js`, `prototype-data.js` ke `_figma-export/`.
- Pindahkan aset ke `assets/`.
- **Selesai bila:** `_figma-export/index.html` masih bisa dibuka seperti sebelumnya.

### Tahap 1 — Design tokens (D1, C1, B3, D3) ✅
- `tokens.css`: primitive (`--navy-900`, `--orange-400`, `--space-2: 8px`, …) lalu semantic (`--color-action-primary`, `--color-status-warning`, `--text-body`, …).
- Petakan ±40 warna ekspor ke ±12 token; perbaiki border agar ≥3:1.
- Skala font 12/16/20/24/32, spasi 4/8/16/24/32/48, radius cukup 3 nilai (8/12/24 + pill).
- ✍️ Kamu menentukan warna accent tunggal (D3) dan menghitung ulang kontrasnya.
- **Selesai bila:** semua token terdokumentasi di komentar dan lolos cek kontras.

### Tahap 2 — Atom & molekul (A3, A4, E1, D4) ✅
- `<button>` dengan varian primary / secondary / destructive dan 6 status (default, hover, focus, active, disabled, loading).
- Badge status (warna + ikon SVG + teks).
- Field: `<label>` di atas + `<input>` (tinggi ≥40–48 px) + helper text + pesan error.
- Halaman `docs/komponen.html` sebagai etalase semua komponen.
- ✍️ Kamu menulis CSS status `:hover` / `:active` / `:disabled` tombol.
- **Selesai bila:** semua komponen bisa dioperasikan hanya dengan keyboard.

### Tahap 3 — Template layout (A1, A2, B1, B2) ✅
- `<header>` (logo + profil) → `<nav>` (3 menu) → `<main>` → `<aside>` (kalender) → `<footer>`.
- Container 1200 px, grid 12 kolom (dashboard 8 + 4), gutter 24 px; turun jadi 1 kolom di <576 px.
- **Selesai bila:** dashboard kosong rapi di 375, 768, dan 1280 px.

### Tahap 4 — Layar satu per satu ✅
Urutan: Login → Dashboard → Prosedur → Pinjam Fasilitas → Ajukan.
- Dashboard: `<h1>` sapaan, `<h2>` "Status peminjaman", kartu status sebagai `<article>`, kalender di `<aside>`.
- **Selesai bila:** tiap layar mirip referensi Figma di desktop dan tetap terbaca di HP.

### Tahap 5 — Interaksi (A4, E2, E3, E4) ✅
- `<dialog>` untuk detail, catatan revisi, dan konfirmasi.
- Dialog konfirmasi kirim dengan 4 elemen wajib: judul spesifik, konsekuensi, "Batal" (kiri) vs aksi (kanan), jalan keluar (×, Batal, Esc).
- Validasi onBlur, tombol "Ajukan" nonaktif sampai valid, state "Mengirim…" ±1 dtk, transisi 150–300 ms.
- ✍️ Kamu menulis fungsi validasi satu field (mis. nomor HP / ID LINE).

### Tahap 6 — Verifikasi ✅
- Cek kontras semua pasangan warna yang dipakai.
- Jalankan seluruh alur hanya dengan keyboard.
- Cek di 375 / 768 / 1280 px.
- Bandingkan tiap layar dengan `_figma-export/`.
- Perbarui `README.md`.

---

## 4. Yang perlu kamu putuskan

1. **Setuju bangun ulang** (rekomendasi) atau tambal kode ekspor?
2. ~~**F1:** gabungkan layar Ruangan/Peralatan/Publikasi?~~ Sudah: digabung sebagai tab di `pinjam.html`.
3. ~~**D3:** warna aksi utama?~~ Sudah: navy `#002647` untuk tombol aksi (sesuai tombol SSO, Tinjau, Ajukan di Figma); oranye hanya aksen (logo, tab aktif) dan CTA di atas latar gelap. Kontras dicek dengan `python3 tools/cek-kontras.py`.

---

## 5. Hasil verifikasi (Tahap 6)

- Kontras: 18/18 pasangan token lolos WCAG AA (`python3 tools/cek-kontras.py`).
- Cek otomatis per halaman: semua kontrol punya nama, semua input punya `<label>`, satu `<h1>`, heading tidak melompat, `lang="id"`, target ≥ 24 px.
- Keyboard: urutan Tab mengikuti urutan visual; dialog memindahkan fokus ke dalam dan Esc mengembalikannya ke tombol pembuka.
- Responsif: tanpa geser horizontal di 375 / 768 / 1280 px untuk semua layar dan tab.

### Belum dikerjakan
- Pengajuan terkirim belum muncul di dashboard (tidak ada penyimpanan data).
- Overlay "Peminjaman Individu" dari Figma.
- Agenda panel Ruangan hanya punya data 11 November.
- Pilihan lengkap dropdown (Lembaga, Program Kerja, Agenda, Keperluan, Lokasi, Durasi).
