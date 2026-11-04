import math
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

W, H = 1920, 1080
OUT_DIR = r"d:\ino website\videos\test_frames"
IMG_DIR = r"d:\ino website\images"
FONT_PATH = r"D:\videos for reels\fonts\Outfit-Variable.ttf"

_FONTS = {}
def get_font(size, bold=True):
    k = (size, bold)
    if k not in _FONTS:
        try:
            _FONTS[k] = ImageFont.truetype(FONT_PATH, size)
        except:
            _FONTS[k] = ImageFont.load_default()
    return _FONTS[k]

def load_img(fn):
    p = os.path.join(IMG_DIR, fn)
    if os.path.exists(p):
        return Image.open(p).convert("RGB")
    return Image.new("RGB", (W, H), (11, 15, 25))

def cover_crop(im, target_w, target_h):
    w, h = im.size
    scale = max(target_w / w, target_h / h)
    nw, nh = int(w * scale), int(h * scale)
    im_res = im.resize((nw, nh), Image.Resampling.LANCZOS)
    cx, cy = (nw - target_w) // 2, (nh - target_h) // 2
    return im_res.crop((cx, cy, cx + target_w, cy + target_h))

IMG_STEEL = load_img("hero_background_metallic_1766962233093.png")

C_CYAN = (0, 210, 255)
C_ACCENT = (255, 117, 24)
C_MINT = (68, 215, 168)
C_GOLD = (255, 200, 80)
C_WHITE = (255, 255, 255)
C_DARK = (8, 11, 17)

# Grid coordinates
y_coords, x_coords = np.ogrid[:H, :W]
cx, cy = W * 0.5, H * 0.5
dist_c = np.sqrt((x_coords - cx)**2 + (y_coords - cy)**2)

# High-contrast glass typography pill (Minimal, elegant, 100% readable)
def draw_luxury_headline(canvas, tag_text, main_text, tag_color=C_CYAN, alpha=255, y_pos=780):
    if alpha <= 0:
        return
        
    draw = ImageDraw.Draw(canvas, "RGBA")
    
    f_tag = get_font(16, bold=True)
    f_main = get_font(68, bold=True)
    
    b_tag = draw.textbbox((0, 0), tag_text, font=f_tag)
    w_tag = b_tag[2] - b_tag[0]
    
    b_main = draw.textbbox((0, 0), main_text, font=f_main)
    w_main = b_main[2] - b_main[0]
    
    content_w = max(w_tag, w_main)
    pad_x = 60
    box_w = min(W - 120, content_w + pad_x * 2)
    box_h = 130
    box_x = (W - box_w) // 2
    box_y = y_pos
    
    a_bg = int(230 * (alpha / 255.0))
    a_border = int(45 * (alpha / 255.0))
    
    # Ultra-clean dark obsidian glass card
    draw.rounded_rectangle(
        [(box_x, box_y), (box_x + box_w, box_y + box_h)],
        radius=20,
        fill=(8, 11, 17, a_bg),
        outline=(255, 255, 255, a_border),
        width=1
    )
    
    # Left colored vertical accent pip
    draw.rounded_rectangle(
        [(box_x + 8, box_y + 14), (box_x + 13, box_y + box_h - 14)],
        radius=3,
        fill=tag_color + (alpha,)
    )
    
    # Tag
    draw.text(((W - w_tag)//2, box_y + 18), tag_text, font=f_tag, fill=tag_color + (int(alpha * 0.95),))
    
    # Main Headline
    tx = (W - w_main) // 2
    ty = box_y + 44
    draw.text((tx + 1, ty + 1), main_text, font=f_main, fill=(0, 0, 0, int(alpha * 0.8)))
    draw.text((tx, ty), main_text, font=f_main, fill=(255, 255, 255, alpha))

def apply_cinematic_bars(im):
    draw = ImageDraw.Draw(im, "RGBA")
    bar_h = 56
    draw.rectangle([(0, 0), (W, bar_h)], fill=(8, 11, 17, 255))
    draw.rectangle([(0, H - bar_h), (W, H)], fill=(8, 11, 17, 255))
    draw.line([(0, bar_h), (W, bar_h)], fill=(65, 105, 225, 80), width=1)
    draw.line([(0, H - bar_h), (W, H - bar_h)], fill=(65, 105, 225, 80), width=1)
    return im

# Beat 1: Brushed Obsidian Steel + Sweeping Cyan Laser Beam
def render_b1(t):
    p = t / 5.0
    scale = 1.0 + 0.05 * p
    steel_crop = cover_crop(IMG_STEEL, int(W * scale), int(H * scale))
    cw, ch = (steel_crop.width - W)//2, (steel_crop.height - H)//2
    base = steel_crop.crop((cw, ch, cw + W, ch + H))
    
    arr = np.array(base, dtype=np.float32)
    # Moving diagonal laser beam
    beam_x = -200 + (W + 400) * p
    beam_d = np.abs((x_coords - beam_x) + (y_coords - H*0.5) * 0.35)
    beam_i = np.exp(- (beam_d**2) / (130.0**2))
    arr[:, :, 1] += beam_i * 140.0
    arr[:, :, 2] += beam_i * 240.0
    
    # Horizontal streak
    strk_d = np.abs(y_coords - (H * 0.48))
    strk = np.exp(- (strk_d**2) / (12.0**2)) * np.exp(- ((x_coords - beam_x)**2) / (600.0**2))
    arr[:, :, 1] += strk * 180.0
    arr[:, :, 2] += strk * 255.0
    
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    im = apply_cinematic_bars(im)
    draw_luxury_headline(im, "01 // ATTENTION", "THEY STOP.", tag_color=C_CYAN, alpha=255)
    return im

# Beat 2: Warm Fluid Dynamic Glow (Amber & Royal Blue Ribbons)
def render_b2(t):
    p = (t - 5.0) / 5.0
    arr = np.zeros((H, W, 3), dtype=np.float32)
    # Deep obsidian vignette
    arr[:, :, 0] = 10.0 + 10.0 * (1.0 - np.clip(dist_c / 900.0, 0, 1))
    arr[:, :, 1] = 9.0 + 10.0 * (1.0 - np.clip(dist_c / 900.0, 0, 1))
    arr[:, :, 2] = 20.0 + 25.0 * (1.0 - np.clip(dist_c / 900.0, 0, 1))
    
    # Swirling fluid ribbons
    ang = p * math.pi * 2.0
    gx = cx + math.cos(ang) * 240
    gy = cy + math.sin(ang * 1.3) * 140
    bx = cx + math.cos(ang + math.pi) * 240
    by = cy + math.sin((ang + math.pi) * 1.3) * 140
    
    dg = np.sqrt((x_coords - gx)**2 + (y_coords - gy)**2)
    db = np.sqrt((x_coords - bx)**2 + (y_coords - by)**2)
    
    # Amber fluid
    arr[:, :, 0] += np.exp(- (dg**2) / (200.0**2)) * 255.0
    arr[:, :, 1] += np.exp(- (dg**2) / (200.0**2)) * 135.0
    arr[:, :, 2] += np.exp(- (dg**2) / (200.0**2)) * 20.0
    
    # Royal blue fluid
    arr[:, :, 0] += np.exp(- (db**2) / (200.0**2)) * 40.0
    arr[:, :, 1] += np.exp(- (db**2) / (200.0**2)) * 120.0
    arr[:, :, 2] += np.exp(- (db**2) / (200.0**2)) * 255.0
    
    # Golden heart core
    arr[:, :, 0] += np.exp(- (dist_c**2) / (160.0**2)) * 220.0
    arr[:, :, 1] += np.exp(- (dist_c**2) / (160.0**2)) * 160.0
    arr[:, :, 2] += np.exp(- (dist_c**2) / (160.0**2)) * 90.0
    
    # Floating bokeh specs
    for i in range(16):
        px = cx + math.sin(p * 2.5 + i * 1.5) * 420
        py = cy + math.cos(p * 2.0 + i * 2.1) * 240
        d_p = np.sqrt((x_coords - px)**2 + (y_coords - py)**2)
        bglow = np.exp(- (d_p**2) / (35.0**2))
        arr[:, :, 0] += bglow * (230 if i % 2 == 0 else 50)
        arr[:, :, 1] += bglow * (140 if i % 2 == 0 else 130)
        arr[:, :, 2] += bglow * (30 if i % 2 == 0 else 240)
        
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    im = apply_cinematic_bars(im)
    draw_luxury_headline(im, "02 // EMOTION", "THEY FEEL.", tag_color=C_ACCENT, alpha=255)
    return im

# Beat 3: Refractive Geometric Crystal Prism (Mint & Cyan Caustic Laser Rays)
def render_b3(t):
    p = (t - 10.0) / 5.0
    arr = np.zeros((H, W, 3), dtype=np.float32)
    arr[:, :, 0] = 7.0
    arr[:, :, 1] = 14.0
    arr[:, :, 2] = 22.0
    
    rot = p * 0.7
    for k in range(6):
        ang = rot + k * (math.pi / 3.0)
        dx, dy = math.cos(ang), math.sin(ang)
        proj = (x_coords - cx) * dx + (y_coords - cy) * dy
        perp = np.abs(- (x_coords - cx) * dy + (y_coords - cy) * dx)
        mask = (proj > 0)
        ray = np.exp(- (perp**2) / (15.0**2)) * np.exp(- proj / 650.0) * mask
        col = C_MINT if k % 2 == 0 else C_CYAN
        arr[:, :, 0] += ray * col[0]
        arr[:, :, 1] += ray * col[1]
        arr[:, :, 2] += ray * col[2]
        
    # Central crystal facet glow
    arr[:, :, 0] += np.exp(- (dist_c**2) / (130.0**2)) * 100.0
    arr[:, :, 1] += np.exp(- (dist_c**2) / (130.0**2)) * 255.0
    arr[:, :, 2] += np.exp(- (dist_c**2) / (130.0**2)) * 220.0
    
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    im = apply_cinematic_bars(im)
    draw_luxury_headline(im, "03 // CERTAINTY", "THEY BELIEVE.", tag_color=C_MINT, alpha=255)
    return im

# Beat 4: Radiant Golden Expansion & Seamless Loop
def render_b4(t):
    p = (t - 15.0) / 5.0
    arr = np.zeros((H, W, 3), dtype=np.float32)
    arr[:, :, 0] = 10.0
    arr[:, :, 1] = 12.0
    arr[:, :, 2] = 24.0
    
    for r in range(3):
        rad = ((p * 1.4 + r * 0.33) % 1.4) * (W * 0.55)
        d_ring = np.abs(dist_c - rad)
        i_ring = np.exp(- (d_ring**2) / (32.0**2)) * (1.0 - (rad / (W * 0.6)))
        arr[:, :, 0] += i_ring * 255.0
        arr[:, :, 1] += i_ring * 190.0
        arr[:, :, 2] += i_ring * 70.0
        
    arr[:, :, 0] += np.exp(- (dist_c**2) / (220.0**2)) * 220.0
    arr[:, :, 1] += np.exp(- (dist_c**2) / (220.0**2)) * 190.0
    arr[:, :, 2] += np.exp(- (dist_c**2) / (220.0**2)) * 255.0
    
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    im = apply_cinematic_bars(im)
    draw_luxury_headline(im, "04 // ACTION", "THEY CHOOSE YOU.", tag_color=C_GOLD, alpha=255)
    return im

f1 = render_b1(2.5)
f2 = render_b2(7.5)
f3 = render_b3(12.5)
f4 = render_b4(17.0)

sheet = Image.new("RGB", (1920, 1080), (8, 11, 17))
tw, th = 880, 495
sheet.paste(f1.resize((tw, th)), (50, 30))
sheet.paste(f2.resize((tw, th)), (990, 30))
sheet.paste(f3.resize((tw, th)), (50, 555))
sheet.paste(f4.resize((tw, th)), (990, 555))
sheet.save(os.path.join(OUT_DIR, "v3_contact.jpg"), quality=95)
print("V3 contact sheet created.")
