// Dashboard: tampilkan pengajuan yang baru dikirim di atas daftar status
"use strict";

const daftarStatus = document.querySelector(".daftar-status");
const templatKartu = document.getElementById("kartu-terkirim");

bacaPengajuan().reverse().forEach((data, i) => {
  const kartu = templatKartu.content.firstElementChild.cloneNode(true);
  const id = `pengajuan-baru-${i}`;
  const judul = kartu.querySelector("h3");
  judul.id = id;
  judul.textContent = data.judul;
  kartu.querySelector("article").setAttribute("aria-labelledby", id);
  kartu.querySelector(".meta").textContent = data.info.slice(0, 2).map(([, nilai]) => nilai).join(" · ");

  const tombol = kartu.querySelector("button");
  tombol.setAttribute("aria-describedby", id);
  tombol.addEventListener("click", () => {
    document.getElementById("detail-baru-judul").textContent = data.judul;
    document.getElementById("detail-baru-info").replaceChildren(...data.info.flatMap(([label, nilai]) => [
      Object.assign(document.createElement("dt"), { textContent: label }),
      Object.assign(document.createElement("dd"), { textContent: nilai }),
    ]));
  });

  daftarStatus.prepend(kartu);
});
