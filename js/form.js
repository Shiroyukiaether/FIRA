// Validasi form: per field saat ditinggalkan (blur), semua field saat dikirim
"use strict";

const IKON_ALERT = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
  '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.5h.01"/></svg>';

function pesanError(field) {
  const v = field.validity;
  const label = field.labels?.[0]?.textContent.replace("*", "").trim() || "Field ini";
  if (v.valueMissing) return `${label} wajib diisi.`;
  if (v.typeMismatch && field.type === "url") return "Masukkan tautan yang valid, contoh: https://drive.google.com/…";
  if (v.badInput) return "Masukkan angka yang valid.";
  if (v.rangeUnderflow) return `Masukkan jumlah minimal ${field.min}.`;
  if (v.rangeOverflow) return field.dataset.errorMax || `Maksimal ${field.max}.`;
  return field.validationMessage;
}

function tampilkanError(field, pesan) {
  const id = `error-${field.id}`;
  let el = document.getElementById(id);

  if (!pesan) {
    field.removeAttribute("aria-invalid");
    if (el) el.hidden = true;
    return;
  }

  if (!el) {
    el = document.createElement("p");
    el.className = "error";
    el.id = id;
    field.after(el);
    const ids = [field.getAttribute("aria-describedby"), id].filter(Boolean).join(" ");
    field.setAttribute("aria-describedby", ids);
  }
  el.innerHTML = IKON_ALERT;
  el.append(` ${pesan}`);
  el.hidden = false;
  field.setAttribute("aria-invalid", "true");
}

function validasiField(field) {
  if (!field.willValidate) return true;
  const valid = field.checkValidity();
  tampilkanError(field, valid ? "" : pesanError(field));
  return valid;
}

// opsi.cekTambahan(): kembalikan elemen untuk difokus bila ada masalah lain, atau null
// opsi.saatValid(): dipanggil bila semua lolos
function pasangValidasi(form, opsi = {}) {
  const field = (el) => el.matches("input, select, textarea");

  form.addEventListener("focusout", (event) => {
    if (field(event.target)) validasiField(event.target);
  });

  form.addEventListener("input", (event) => {
    if (event.target.getAttribute("aria-invalid") === "true") validasiField(event.target);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const gagal = [...form.elements].filter(field).filter((el) => !validasiField(el));
    const lain = opsi.cekTambahan?.();
    const fokus = gagal[0] || lain;
    if (fokus) {
      fokus.focus();
      return;
    }
    opsi.saatValid?.();
  });
}

// Tombol kirim: status loading ±1 detik, cegah klik ganda, lalu lanjut
function kirimDenganLoading(tombol, selesai) {
  const teks = tombol.textContent;
  tombol.disabled = true;
  tombol.setAttribute("aria-busy", "true");
  tombol.textContent = "Mengirim…";

  setTimeout(() => {
    tombol.disabled = false;
    tombol.removeAttribute("aria-busy");
    tombol.textContent = teks;
    selesai();
  }, 1000);
}
