/* FIRA — browser implementation of the interactions in Hi-Fi FINAL EXTRA. */
"use strict";

const { views, defaults, events, actions } = prototypeData;
const state = { ...defaults };
const screen = document.querySelector("#screen");
const dialogs = document.querySelector("#dialogs");
const loginView = "194:294";
let currentScreen;
const openDialogs = [];

function activeView() {
  return openDialogs.length ? openDialogs[openDialogs.length - 1].view : screen;
}

function evaluate(value) {
  if (value === null || typeof value !== "object") return value;
  if (Object.hasOwn(value, "var")) return state[value.var];
  const [operator, left, right] = value;
  const a = evaluate(left);
  const b = evaluate(right);
  switch (operator) {
    case "EQUALS": return a === b;
    case "LESS_THAN": return a < b;
    case "GREATER_THAN": return a > b;
    case "AND": return Boolean(a && b);
    case "OR": return Boolean(a || b);
    case "ADDITION": return a + b;
    case "SUBTRACTION": return a - b;
    case "MULTIPLICATION": return a * b;
    default: throw new Error("Unsupported expression: " + operator);
  }
}

function updateBindings(container) {
  for (const element of container.querySelectorAll("[data-visible]")) {
    element.hidden = !state[element.dataset.visible];
  }
  for (const element of container.querySelectorAll("[data-characters]")) {
    const label = element.firstElementChild;
    const text = String(state[element.dataset.characters] ?? "");
    if (label.textContent !== text) label.textContent = text;
  }
  for (const element of container.querySelectorAll("[data-height]")) {
    element.style.height = state[element.dataset.height] + "px";
  }
}

function layout() {
  const size = views[currentScreen || loginView];
  // Preserve the desktop composition while keeping every modal within the viewport.
  const scale = Math.min(innerWidth / size.w, innerHeight / size.h);
  document.documentElement.style.setProperty("--scale", scale);
}

function instantiate(id) {
  const template = document.getElementById("view-" + id.replaceAll(":", "-"));
  if (!template) throw new Error("Missing view: " + id);
  const surface = document.createElement("div");
  surface.className = "viewport";
  surface.style.width = views[id].w + "px";
  surface.style.height = views[id].h + "px";
  surface.append(template.content.cloneNode(true));
  updateBindings(surface);
  return surface;
}

function closeDialog(restoreFocus = true) {
  const entry = openDialogs.pop();
  if (!entry) return;
  entry.view.remove();
  activeView().inert = false;
  if (restoreFocus && entry.opener?.isConnected) entry.opener.focus({ preventScroll: true });
}

function openDialog(id, swap = false) {
  const opener = swap && openDialogs.length
    ? openDialogs[openDialogs.length - 1].opener
    : document.activeElement;
  if (swap) closeDialog(false);
  activeView().inert = true;
  const dialog = document.createElement("div");
  dialog.className = "dialog-backdrop";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-label", views[id].name.replace(/^Overlay · /, ""));
  dialog.tabIndex = -1;
  dialog.append(instantiate(id));
  dialogs.append(dialog);
  openDialogs.push({ view: dialog, opener });
  dialog.focus({ preventScroll: true });
}

function showScreen(id, writeHistory = true) {
  if (!views[id]?.screen) id = loginView;
  while (openDialogs.length) closeDialog(false);
  currentScreen = id;
  if (writeHistory && location.hash !== "#" + id) history.pushState(null, "", "#" + id);
  screen.replaceChildren(instantiate(id));
  screen.setAttribute("aria-label", views[id].name);
  document.title = views[id].name.replace(/^Layar \d+: /, "") + " · FIRA";
  layout();
}

function run(sequence) {
  for (const index of sequence) {
    const [operation, target, value, ...rest] = actions[index];
    switch (operation) {
      case "set":
        state[target] = evaluate(value);
        break;
      case "if": {
        const branch = [target, value, ...rest].find(block => block && evaluate(block[0]));
        if (branch) run(branch[1]);
        break;
      }
      case "NAVIGATE": showScreen(target); break;
      case "OVERLAY": openDialog(target); break;
      case "SWAP": openDialog(target, true); break;
      case "close": closeDialog(); break;
      case "url": window.open(target, "_blank", "noopener,noreferrer"); break;
      default: throw new Error("Unsupported action: " + operation);
    }
  }
}

function perform(sequence) {
  run(sequence);
  updateBindings(screen);
  updateBindings(dialogs);
}

document.addEventListener("click", event => {
  const control = event.target.closest(".control");
  if (!control || !activeView().contains(control)) return;
  const handler = events[control.dataset.events]?.find(entry => entry.on === "ON_CLICK");
  if (handler) perform(handler.actions);
});

document.addEventListener("keydown", event => {
  const view = activeView();
  const code = event.keyCode;
  const modifiers = [event.ctrlKey ? 17 : 0, event.shiftKey ? 16 : 0, event.altKey ? 18 : 0].filter(Boolean);
  const pressed = new Set([...modifiers, code]);
  for (const element of view.querySelectorAll("[data-events]")) {
    if (element.closest("[hidden]")) continue;
    const handler = events[element.dataset.events].find(entry =>
      entry.on === "ON_KEY_DOWN" && entry.keys?.length === pressed.size &&
      entry.keys.every(key => pressed.has(key))
    );
    if (handler) {
      event.preventDefault();
      perform(handler.actions);
      return;
    }
  }
  if (event.key === "Escape" && openDialogs.length) {
    event.preventDefault();
    closeDialog();
    return;
  }
  if (["Enter", " "].includes(event.key) && document.activeElement?.matches(".control")) {
    event.preventDefault();
    document.activeElement.click();
  }
  if (event.key === "Tab" && openDialogs.length) {
    const focusable = [...view.querySelectorAll(".control")].filter(el => !el.closest("[hidden]"));
    const boundary = event.shiftKey ? focusable[0] : focusable[focusable.length - 1];
    if (boundary && document.activeElement === boundary) {
      event.preventDefault();
      (event.shiftKey ? focusable[focusable.length - 1] : focusable[0]).focus();
    }
  }
});

window.addEventListener("resize", layout);
window.addEventListener("popstate", () => showScreen(location.hash.slice(1), false));
showScreen(location.hash.slice(1), false);
