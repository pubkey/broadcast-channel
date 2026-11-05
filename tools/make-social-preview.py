#!/usr/bin/env python3
"""Generate the 1200x630 social preview card for broadcast-channel.

Portable: no machine paths. Fonts resolved via BC_FONT_DIR -> ./fonts -> ~/.fonts -> system.
Reproduces the project's own hero: real logo (docs/files/icon.png), real tagline,
domain as plain text, on white.
"""
import os, sys
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
LOGO = os.path.join(os.path.dirname(__file__), "..", "docs", "files", "icon.png")
TAGLINE = "A BroadcastChannel to send data across multiple browser-tabs or nodejs-processes or Deno-Deploy-Instances"
DOMAIN = "pubkey.github.io/broadcast-channel"

def find_font(candidates):
    for c in candidates:
        if os.path.exists(c):
            return c
    return None

def font_path(rel):
    dirs = [os.environ.get("BC_FONT_DIR", ""), os.path.join(os.path.dirname(__file__), "..", "fonts"),
            os.path.expanduser("~/.fonts"), "/usr/share/fonts/truetype/dejavu", "/usr/share/fonts/truetype/liberation"]
    for d in dirs:
        if d and os.path.exists(os.path.join(d, rel)):
            return os.path.join(d, rel)
    return None

def load(size, rel):
    p = font_path(rel)
    if p:
        return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def wrap(draw, text, font, maxw):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=font) <= maxw:
            cur = t
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines

def main():
    img = Image.new("RGB", (W, H), "white")
    draw = ImageDraw.Draw(img)

    # Logo centered upper area
    logo = Image.open(LOGO).convert("RGBA")
    lw = 220
    lh = int(logo.height * lw / logo.width)
    logo = logo.resize((lw, lh), Image.LANCZOS)
    img.paste(logo, ((W - lw)//2, 90), logo)

    # Tagline (wrapped, muted slate blue)
    tag_font = load(44, "DejaVuSans-Bold.ttf")
    slate = (70, 90, 130)
    lines = wrap(draw, TAGLINE, tag_font, W - 220)
    y = 90 + lh + 60
    for ln in lines:
        tw = draw.textlength(ln, font=tag_font)
        draw.text(((W - tw)//2, y), ln, font=tag_font, fill=slate)
        y += 58

    # Domain (plain grey)
    dom_font = load(34, "DejaVuSans.ttf")
    grey = (120, 120, 120)
    dw = draw.textlength(DOMAIN, font=dom_font)
    draw.text(((W - dw)//2, H - 90), DOMAIN, font=dom_font, fill=grey)

    out = os.path.join(os.path.dirname(__file__), "..", "docs", "files", "social-preview.png")
    img.save(out, "PNG")
    print("wrote", out)

if __name__ == "__main__":
    main()
