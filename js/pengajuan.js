// Simpan pengajuan terkirim selama tab browser terbuka (simulasi, tanpa server)
"use strict";

const KUNCI_PENGAJUAN = "fira-pengajuan";

function bacaPengajuan() {
  try {
    return JSON.parse(sessionStorage.getItem(KUNCI_PENGAJUAN)) || [];
  } catch {
    return [];
  }
}

// data: { judul: "Pelatihan HMDTIF · Ruangan", info: [["Ruangan", "…"], ["Jadwal", "…"]] }
function simpanPengajuan(data) {
  try {
    sessionStorage.setItem(KUNCI_PENGAJUAN, JSON.stringify([data, ...bacaPengajuan()]));
  } catch {
    // Penyimpanan diblokir browser: dashboard tetap jalan tanpa kartu baru
  }
}
