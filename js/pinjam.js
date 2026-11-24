// Halaman Pinjam Fasilitas: slot ruangan, daftar alat, ringkasan, tinjau & kirim
"use strict";

const ALAT = [
  { nama: "TV", stok: 5, satuan: "unit" },
  { nama: "Papan Tulis", stok: 10, satuan: "unit" },
  { nama: "Backdrop", stok: 1, satuan: "unit" },
  { nama: "Sound System (Speaker & Mic)", stok: 1, satuan: "set" },
  { nama: "LCD Proyektor", stok: 3, satuan: "unit" },
  { nama: "Layar Proyektor", stok: 3, satuan: "unit" },
  { nama: "BOSS KTN-50 (Amplifier)", stok: 2, satuan: "unit" },
  { nama: "HARTKE AMPLI BASS HD-75C (Amplifier)", stok: 1, satuan: "unit" },
  { nama: "NUX AMPLI PA 50 (Amplifier)", stok: 1, satuan: "unit" },
  { nama: "YAMAHA BASS BB 434 (Bass)", stok: 1, satuan: "unit" },
  { nama: "NUX ELECTRIC DRUM DM-8 (Drum)", stok: 1, satuan: "unit" },
  { nama: "NUX EFFECT GITAR MG-30 (Effect)", stok: 2, satuan: "unit" },
  { nama: "SCHECTER BANSHEE-6 FR SGR (Gitar)", stok: 1, satuan: "unit" },
  { nama: "YAMAHA GITAR PAC212VFMC (Gitar)", stok: 1, satuan: "unit" },
  { nama: "KORG KROSS 2-61 (Keyboard)", stok: 1, satuan: "unit" },
  { nama: "AKG MIC WIRED P5S (Mikrofon)", stok: 2, satuan: "unit" },
  { nama: "MIXER DIGITAL XR-18 (Mixer)", stok: 1, satuan: "unit" },
  { nama: "AUDIOCENTER MA-12 (Speaker)", stok: 2, satuan: "unit" },
  { nama: "Stand Microphone (Stand)", stok: 2, satuan: "unit" },
  { nama: "Stand Speaker (Stand)", stok: 2, satuan: "unit" },
];

const $ = (id) => document.getElementById(id);

function formatTanggal(nilai, bulan = "short") {
  if (!nilai) return "–";
  return new Date(`${nilai}T00:00`).toLocaleDateString("id-ID", { day: "numeric", month: bulan, year: "numeric" });
}

/* ---------- Ruangan: tanggal → ruang → slot → form ---------- */
const pilihan = { tanggal: "11 November 2026", ruang: "" };

// Agenda per tanggal (dari data desain), kunci = tanggal ISO
const AGENDA = {
  "2026-11-11": [
    { nama: "RAION EXHIBITION", jam: "08.00–16.00 WIB", tempat: "GKM Lt 1 Open Space", oleh: "RAION" },
    { nama: "PEMILWA FILKOM 2026", jam: "08.00–14.00 WIB", tempat: "Junction", oleh: "DPM" },
  ],
  "2026-11-19": [
    { nama: "RABIR AF", jam: "17.00–20.00 WIB", tempat: "Ruang GKM 3.1", oleh: "SGE" },
  ],
  "2026-11-25": [
    { nama: "Koordinasi Panitia", jam: "10.00–12.00 WIB", tempat: "Ruang GKM 4.1 (Kanan)" },
  ],
};

function tampilkanAgenda(iso) {
  const acara = AGENDA[iso] || [];
  const hari = new Date(`${iso}T00:00`).toLocaleDateString("id-ID", { weekday: "long" });
  const jumlah = acara.length ? `${acara.length} agenda` : "belum ada agenda";
  $("agenda-tanggal").textContent = `${hari}, ${formatTanggal(iso, "long")} · ${jumlah}`;
  $("agenda-daftar").replaceChildren(...acara.map((a) => {
    const li = document.createElement("li");
    li.innerHTML = "<h4></h4><p></p><p></p>";
    li.querySelector("h4").textContent = a.nama;
    li.children[1].textContent = `${a.jam} · ${a.tempat}`;
    if (a.oleh) li.children[2].textContent = `Penyelenggara: ${a.oleh}`;
    else li.children[2].remove();
    return li;
  }));
}

document.querySelectorAll(".hari[data-tanggal]").forEach((tombol) => {
  tombol.addEventListener("click", () => {
    document.querySelectorAll(".hari[data-tanggal]").forEach((t) => t.setAttribute("aria-pressed", "false"));
    tombol.setAttribute("aria-pressed", "true");
    pilihan.tanggal = formatTanggal(tombol.dataset.tanggal, "long");
    $("slot-tanggal").textContent = pilihan.tanggal;
    tampilkanAgenda(tombol.dataset.tanggal);
  });
});

document.querySelectorAll("[data-ruang]").forEach((tombol) => {
  tombol.addEventListener("click", () => {
    pilihan.ruang = tombol.dataset.ruang;
    $("slot-ruang").textContent = `${pilihan.ruang} · ${pilihan.tanggal}`;
  });
});

document.querySelectorAll("[data-jam]").forEach((tombol) => {
  tombol.addEventListener("click", () => {
    const query = new URLSearchParams({ ruang: pilihan.ruang, jadwal: `${pilihan.tanggal} · ${tombol.dataset.jam}` });
    location.href = `ajukan-ruangan.html?${query}`;
  });
});

/* ---------- Ruangan: jalur Individu ---------- */
document.querySelectorAll("[data-jam-individu]").forEach((tombol) => {
  tombol.addEventListener("click", () => {
    $("individu-jadwal").textContent = `17 November 2026 · ${tombol.dataset.jamIndividu}`;
  });
});

$("tombol-kirim-individu").addEventListener("click", (event) => {
  kirimDenganLoading(event.currentTarget, () => {
    simpanPengajuan({
      judul: "Peminjaman Individu · Ruangan",
      info: [["Ruangan", "Lapangan Basket"], ["Tanggal dan jam", $("individu-jadwal").textContent]],
    });
    $("dlg-konfirmasi-individu").close();
    $("dlg-terkirim").showModal();
  });
});

/* ---------- Peralatan ---------- */
const daftarAlat = $("daftar-alat");
const pilihAlat = $("pilih-alat");
const alatKosong = $("alat-kosong");
const tombolTambah = $("tombol-tambah-alat");
const tglAmbil = $("tgl-ambil");
const tglKembali = $("tgl-kembali");

// Isi dialog "Pilih peralatan" dari data
ALAT.forEach((alat, i) => {
  const li = document.createElement("li");
  li.innerHTML = `<button type="button" class="pilihan-alat" data-index="${i}">
      <span>${alat.nama}</span><span class="hint">${alat.stok} ${alat.satuan}</span>
    </button>`;
  pilihAlat.append(li);
});

pilihAlat.addEventListener("click", (event) => {
  const tombol = event.target.closest("[data-index]");
  if (!tombol) return;
  const alat = ALAT[tombol.dataset.index];
  const id = `jumlah-${tombol.dataset.index}`;
  const baris = $("baris-alat").content.firstElementChild.cloneNode(true);

  baris.querySelector("label").textContent = alat.nama;
  baris.querySelector("label").htmlFor = id;
  baris.querySelector(".hint").id = `stok-${id}`;
  baris.querySelector(".hint").textContent = `Tersedia ${alat.stok} ${alat.satuan}`;
  baris.querySelector(".satuan").textContent = alat.satuan;
  const input = baris.querySelector("input");
  Object.assign(input, { id, name: id, max: alat.stok });
  input.setAttribute("aria-describedby", `stok-${id}`);
  const hapus = baris.querySelector("button");
  hapus.setAttribute("aria-label", `Hapus ${alat.nama}`);
  hapus.addEventListener("click", () => {
    baris.remove();
    tombol.disabled = false;
    perbaruiAlat();
    tombolTambah.focus();
  });

  daftarAlat.append(baris);
  tombol.disabled = true;
  $("dlg-pilih-alat").close();
  perbaruiAlat();
  input.focus();
  input.select();
});

function ringkasAlat() {
  return [...daftarAlat.querySelectorAll("li")].map((li) =>
    `${li.querySelector("label").textContent} × ${li.querySelector("input").value || 0} ${li.querySelector(".satuan").textContent}`);
}

function perbaruiAlat() {
  const isi = ringkasAlat();
  alatKosong.hidden = isi.length > 0;
  alatKosong.className = "hint";
  alatKosong.textContent = "Belum ada peralatan. Pilih Tambah alat.";
  $("ringkas-alat").textContent = isi.length ? isi.join(", ") : "Belum ada peralatan.";
}

function cekTanggal() {
  tglKembali.setCustomValidity(tglKembali.value && tglKembali.value < tglAmbil.value
    ? "Tanggal pengembalian harus sama atau sesudah tanggal pengambilan." : "");
  if (tglKembali.value) validasiField(tglKembali);
  $("ringkas-ambil").textContent = formatTanggal(tglAmbil.value);
  $("ringkas-kembali").textContent = formatTanggal(tglKembali.value);
}

daftarAlat.addEventListener("input", perbaruiAlat);
tglAmbil.addEventListener("change", cekTanggal);
tglKembali.addEventListener("change", cekTanggal);

pasangValidasi($("form-peralatan"), {
  cekTambahan() {
    if (daftarAlat.children.length) return null;
    alatKosong.hidden = false;
    alatKosong.className = "error";
    alatKosong.textContent = "Tambahkan minimal satu peralatan.";
    return tombolTambah;
  },
  saatValid() {
    $("tinjau-alat").replaceChildren(...ringkasAlat().map((teks) => Object.assign(document.createElement("li"), { textContent: teks })));
    $("tinjau-ambil").textContent = formatTanggal(tglAmbil.value);
    $("tinjau-kembali").textContent = formatTanggal(tglKembali.value);
    $("dlg-tinjau-alat").showModal();
  },
});

/* ---------- Publikasi ---------- */
const formPublikasi = $("form-publikasi");

function perbaruiPublikasi() {
  const nilai = {
    lokasi: $("lokasi").value,
    mulai: formatTanggal($("mulai").value, "long"),
    durasi: $("durasi").value,
  };
  for (const [kunci, teks] of Object.entries(nilai)) {
    $(`ringkas-${kunci}`).textContent = teks;
    $(`tinjau-${kunci}`).textContent = teks;
  }
}

formPublikasi.addEventListener("change", perbaruiPublikasi);
pasangValidasi(formPublikasi, {
  saatValid() {
    perbaruiPublikasi();
    $("dlg-tinjau-pub").showModal();
  },
});

/* ---------- Kirim (dari dialog tinjau) ---------- */
const DATA_KIRIM = {
  "dlg-tinjau-alat": () => ({
    judul: "Demo Multimedia · Peralatan",
    info: [
      ["Peralatan", ringkasAlat().join(", ")],
      ["Periode", `${formatTanggal(tglAmbil.value)} – ${formatTanggal(tglKembali.value)}`],
    ],
  }),
  "dlg-tinjau-pub": () => ({
    judul: "RABIR AF · Publikasi",
    info: [
      ["Lokasi signage", $("lokasi").value],
      ["Mulai tayang", formatTanggal($("mulai").value, "long")],
      ["Durasi tayang", $("durasi").value],
    ],
  }),
};

document.querySelectorAll("[data-kirim]").forEach((tombol) => {
  tombol.addEventListener("click", () => {
    const dialog = tombol.closest("dialog");
    kirimDenganLoading(tombol, () => {
      simpanPengajuan(DATA_KIRIM[dialog.id]());
      dialog.close();
      $("dlg-terkirim").showModal();
    });
  });
});
