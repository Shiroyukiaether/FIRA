# FIRA

FILKOM Integrated Resource Access merupakan prototipe interaktif untuk pengajuan peminjaman ruangan, peralatan, dan publikasi FILKOM.

## Menjalankan

Unduh atau klon repositori, lalu buka `index.html` di browser. Seluruh aset disimpan bersama kode. Instalasi dan server tidak diperlukan.

## Alur demonstrasi

1. Pilih **SSO Universitas Brawijaya** untuk membuka dashboard demo.
2. Gunakan **Prosedur** untuk membaca panduan dan memeriksa kelengkapan dokumen.
3. Pada **Pinjam Fasilitas**, pilih Ruangan, Peralatan, atau Publikasi.
4. Coba tambah dua jenis alat dengan jumlah berbeda. Jumlah di atas stok dan tanggal pengembalian sebelum pengambilan akan menahan pengajuan.
5. Tinjau lalu kirim pengajuan. Pada dashboard, buka **Lihat Detail** untuk melihat data yang dikirim.

## Isi repositori

- `index.html` berisi tujuh layar dan templat overlay dari tab **HI-Fi FINAL EXTRA**. Teks, kartu, ikon, dan tombol dapat diedit di HTML.
- `styles.css` mengatur tipografi, warna, tata letak, dan tampilan gulir. Komposisi desktop mengikuti kanvas asli 1440 × 810.
- `prototype-data.js` memuat nilai awal dan hubungan antarinteraksi yang diterjemahkan dari Figma.
- `app.js` menangani navigasi, dialog, interaksi keyboard, perubahan formulir, dan validasi.
- `avatar.png` merupakan aset profil pada desain sumber.

SSO dan pengajuan berjalan sebagai simulasi di browser. Data kembali ke kondisi awal ketika halaman dimuat ulang. Kalender peralatan menggunakan periode demo November 2026 hingga Oktober 2027.

[Desain sumber di Figma](https://www.figma.com/design/2AMa50O6OcySAVAQYFsmX6/Proyek-Akhir-IMK-Tahap-2?node-id=194-32)
