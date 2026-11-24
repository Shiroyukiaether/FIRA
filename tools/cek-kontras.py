"""Cek kontras WCAG 2.2 pasangan token di css/tokens.css.  Jalankan: python3 tools/cek-kontras.py"""
import re
import sys
from pathlib import Path

CSS = Path(__file__).resolve().parent.parent / "css" / "tokens.css"

# (teks/depan, latar, batas minimal)  4.5 = teks normal, 3.0 = komponen/border/fokus
PAIRS = [
    ("--color-text", "--color-bg-page", 4.5),
    ("--color-text", "--color-bg-surface", 4.5),
    ("--color-text-muted", "--color-bg-page", 4.5),
    ("--color-text-muted", "--color-bg-surface", 4.5),
    ("--color-text-on-action", "--color-action-primary", 4.5),
    ("--color-text-on-action", "--color-action-primary-hover", 4.5),
    ("--color-action-primary", "--color-action-on-dark", 4.5),
    ("--color-border-control", "--color-bg-surface", 3.0),
    ("--color-border-control", "--color-bg-page", 3.0),
    ("--color-focus-ring", "--color-bg-surface", 3.0),
    ("--color-focus-ring", "--color-bg-page", 3.0),
    ("--color-focus-ring", "--color-action-primary", 3.0),
    ("--color-status-warning", "--color-status-warning-bg", 4.5),
    ("--color-status-danger", "--color-status-danger-bg", 4.5),
    ("--color-status-success", "--color-status-success-bg", 4.5),
    ("--color-cat-ruangan", "--color-cat-ruangan-bg", 4.5),
    ("--color-cat-peralatan", "--color-cat-peralatan-bg", 4.5),
    ("--color-cat-publikasi", "--color-cat-publikasi-bg", 4.5),
]


def luminance(hex_color):
    channels = [int(hex_color[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    r, g, b = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in channels]
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(a, b):
    hi, lo = sorted([luminance(a), luminance(b)], reverse=True)
    return (hi + 0.05) / (lo + 0.05)


def load_tokens(text):
    raw = dict(re.findall(r"(--[\w-]+):\s*([^;]+);", text))

    def resolve(name):
        value = raw[name].strip()
        ref = re.fullmatch(r"var\((--[\w-]+)\)", value)
        return resolve(ref.group(1)) if ref else value

    return resolve


assert abs(ratio("#ffffff", "#000000") - 21) < 0.01  # rumus benar
assert abs(ratio("#ffffff", "#2563eb") - 5.17) < 0.01  # contoh IMK 06

resolve = load_tokens(CSS.read_text())
failed = 0
for fg, bg, minimum in PAIRS:
    value = ratio(resolve(fg), resolve(bg))
    ok = value >= minimum
    failed += not ok
    print(f"{'LULUS' if ok else 'GAGAL'}  {value:5.2f}:1 (min {minimum})  {fg} di atas {bg}")

sys.exit(1 if failed else 0)
