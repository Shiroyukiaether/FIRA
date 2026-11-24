// Form Ajukan Peminjaman Ruangan
"use strict";

const formAjukan = document.getElementById("form-ajukan");
const fieldsetLembaga = document.getElementById("fieldset-lembaga");

// Ruang & jadwal dari halaman Pinjam Fasilitas
const query = new URLSearchParams(location.search);
for (const kunci of ["ruang", "jadwal"]) {
  const nilai = query.get(kunci);
  if (nilai) {
    document.querySelectorAll(`[data-isi="${kunci}"]`).forEach((el) => { el.textContent = nilai; });
  }
}

// Individu: bagian lembaga disembunyikan dan tidak divalidasi
formAjukan.addEventListener("change", (event) => {
  if (event.target.name !== "jenis-pengaju") return;
  const individu = event.target.value === "individu";
  fieldsetLembaga.hidden = individu;
  fieldsetLembaga.disabled = individu;
});

pasangValidasi(formAjukan, {
  saatValid: () => document.getElementById("dlg-konfirmasi").showModal(),
});

document.getElementById("tombol-kirim").addEventListener("click", (event) => {
  kirimDenganLoading(event.currentTarget, () => {
    document.getElementById("dlg-konfirmasi").close();
    document.getElementById("dlg-terkirim").showModal();
  });
});
