# FIRA

FILKOM Integrated Resource Access merupakan prototipe interaktif untuk pengajuan peminjaman ruangan, peralatan, dan publikasi FILKOM.

## Menjalankan

Unduh atau klon repositori, lalu buka `index.html` di browser. Tanpa instalasi, tanpa server, tanpa library.

## Alur demonstrasi

1. **Login** – pilih **SSO Universitas Brawijaya** untuk membuka dashboard demo.
2. **Dashboard** – buka **Lihat Detail**, **Lihat Catatan**, **Tampilkan e-Pass**, atau **Notifikasi**.
3. **Prosedur** – baca alur, centang checklist dokumen, buka panduan per kategori.
4. **Pinjam Fasilitas** – pilih tab Ruangan, Peralatan, atau Publikasi.
   - Ruangan: pilih tanggal bertanda panah → ruang → slot → formulir.
   - Peralatan: tambah alat, isi jumlah. Jumlah di atas stok dan tanggal kembali sebelum tanggal ambil akan menahan pengajuan.
5. **Ajukan** – isi formulir, konfirmasi, lalu kirim.

SSO dan pengajuan berjalan sebagai simulasi di browser. Data kembali ke kondisi awal ketika halaman dimuat ulang.

## Isi repositori

| Path | Isi |
|---|---|
| `index.html` | Layar 1 · Login |
| `dashboard.html` | Layar 2 · Dashboard & status peminjaman |
| `prosedur.html` | Layar 3 · Prosedur & peraturan |
| `pinjam.html` | Layar 4 · Pinjam Fasilitas (tab Ruangan / Peralatan / Publikasi) |
| `ajukan-ruangan.html` | Layar 5 · Formulir peminjaman ruangan |
| `css/tokens.css` | Design tokens: warna, spasi, tipografi, radius |
| `css/base.css` | Font, reset, heading, fokus keyboard |
| `css/components.css` | Tombol, badge, field, kartu, dialog |
| `css/layout.css` | Container, grid 12 kolom, header, pola halaman |
| `js/` | Dialog, tab, validasi formulir, logika per halaman |
| `docs/komponen.html` | Etalase semua komponen |
| `docs/rencana-perbaikan.md` | Audit & rencana berdasarkan materi IMK 05 dan 06 |
| `tools/cek-kontras.py` | Cek kontras WCAG 2.2 semua pasangan token |
| `_figma-export/` | Ekspor Figma asli, hanya sebagai referensi (juga di tag `v0-figma-export`) |

## Cek kontras

```bash
python3 tools/cek-kontras.py
```

[Desain sumber di Figma](https://www.figma.com/design/2AMa50O6OcySAVAQYFsmX6/Proyek-Akhir-IMK-Tahap-2?node-id=194-32)
