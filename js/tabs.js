// Tab kategori: tanpa JS tetap berupa link ke panel; dengan JS jadi tab sungguhan
"use strict";

const daftarTab = document.querySelector(".segmen ul");

if (daftarTab) {
  const tabs = [...daftarTab.querySelectorAll("a")];
  const panels = tabs.map((tab) => document.querySelector(tab.hash));

  daftarTab.setAttribute("role", "tablist");
  tabs.forEach((tab, i) => {
    tab.parentElement.setAttribute("role", "presentation");
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", panels[i].id);
    panels[i].setAttribute("role", "tabpanel");
  });

  function pilihTab(index, fokus = false) {
    tabs.forEach((tab, i) => {
      const aktif = i === index;
      tab.setAttribute("aria-selected", String(aktif));
      tab.tabIndex = aktif ? 0 : -1;
      panels[i].hidden = !aktif;
    });
    if (fokus) tabs[index].focus();
    history.replaceState(null, "", tabs[index].hash);
  }

  daftarTab.addEventListener("click", (event) => {
    const index = tabs.indexOf(event.target.closest("[role='tab']"));
    if (index < 0) return;
    event.preventDefault();
    pilihTab(index);
  });

  // Panah kiri/kanan pindah tab, Spasi memilih
  daftarTab.addEventListener("keydown", (event) => {
    const index = tabs.indexOf(document.activeElement);
    const arah = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (arah) {
      event.preventDefault();
      pilihTab((index + arah + tabs.length) % tabs.length, true);
    } else if (event.key === " ") {
      event.preventDefault();
      pilihTab(index);
    }
  });

  pilihTab(Math.max(0, tabs.findIndex((tab) => tab.hash === location.hash)));
}
