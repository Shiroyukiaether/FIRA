// Dialog: buka lewat [data-dialog], tutup lewat tombol form[method=dialog], Esc, atau klik latar
"use strict";

document.addEventListener("click", (event) => {
  const pembuka = event.target.closest("[data-dialog]");
  if (pembuka) {
    pembuka.closest("dialog")?.close();
    document.getElementById(pembuka.dataset.dialog).showModal();
    return;
  }

  // Klik di latar redup, di luar kotak dialog
  const dialog = event.target;
  if (dialog instanceof HTMLDialogElement) {
    const kotak = dialog.getBoundingClientRect();
    const diLuar = event.clientX < kotak.left || event.clientX > kotak.right ||
                   event.clientY < kotak.top || event.clientY > kotak.bottom;
    if (diLuar) dialog.close();
  }
});
