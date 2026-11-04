"""
InoConnect Psychology Hero Film (20.0s Seamless Abstract Loop)
=============================================================
- Minimal content: Just the 4 core psychological verbs
  1. THEY STOP. (Attention / Pattern Interrupt)
  2. THEY FEEL. (Emotion / Identity & Desire)
  3. THEY BELIEVE. (Certainty / Trust & Credibility)
  4. THEY CHOOSE YOU. (Action / Conversion & Compounding Loyalty)
- High-end 3D abstracts, dynamic laser sweeps, fluid particle glows, and glass holography
- 100% Closed-ended seamless loop (Last 1.5s cross-dissolves invisibly into 0:00)
- No logos, no company name inside the video (clean luxury showcase)
- Mastered 20s seamless ambient house audio loop
"""

import os
import sys
import math
import subprocess
import shutil
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
W, H = 1920, 1080
FPS = 30
TOTAL_SEC = 20.0
TOTAL_FRAMES = int(TOTAL_SEC * FPS)  # 600 frames

OUT_DIR = r"d:\ino website\videos"
IMG_DIR = r"d:\ino website\images"
FONT_PATH = r"D:\videos for reels\fonts\Outfit-Variable.ttf"
AUDIO_LOOP = os.path.join(OUT_DIR, "ambient_psychology_audio.wav")
RAW_MP4 = os.path.join(OUT_DIR, "psychology_raw.mp4")
FINAL_MP4 = os.path.join(OUT_DIR, "inoconnect-hero-showreel.mp4")
DOWNLOADS_COPY = r"C:\Users\talha\Downloads\InoConnect_Hero_Showreel.mp4"
STORYBOARD_JPG = os.path.join(OUT_DIR, "inoconnect_hero_storyboard.jpg")

os.makedirs(OUT_DIR, exist_ok=True)

# Colors
C_DARK = (8, 11, 17)
C_PRIMARY = (65, 105, 225)      # Royal Blue
C_ACCENT = (255, 117, 24)       # Electric Orange
C_MINT = (68, 215, 168)         # Neon Mint
C_CYAN = (0, 210, 255)          # Cyber Cyan
C_GOLD = (255, 195, 75)         # Warm Gold
C_WHITE = (255, 255, 255)

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
IMG_TOWERS = load_img("inoconnect_ai_automation_hero.png")
IMG_MATRIX = load_img("inoconnect_about_clean_hero.png")

# Precompute coordinate grids
y_coords, x_coords = np.ogrid[:H, :W]
cx, cy = W * 0.5, H * 0.5
dist_c = np.sqrt((x_coords - cx)**2 + (y_coords - cy)**2)

def ease_in_out(x):
    return 0.5 - math.cos(math.pi * x) / 2

def ease_out_cubic(x):
    return 1 - math.pow(1 - x, 3)

def apply_cinematic_bars(im):
    draw = ImageDraw.Draw(im, "RGBA")
    bar_h = 56
    draw.rectangle([(0, 0), (W, bar_h)], fill=(8, 11, 17, 255))
    draw.rectangle([(0, H - bar_h), (W, H)], fill=(8, 11, 17, 255))
    draw.line([(0, bar_h), (W, bar_h)], fill=(65, 105, 225, 80), width=1)
    draw.line([(0, H - bar_h), (W, H - bar_h)], fill=(65, 105, 225, 80), width=1)
    return im

def draw_luxury_headline(canvas, tag_text, main_text, tag_color=C_CYAN, alpha_factor=1.0, y_pos=770):
    if alpha_factor <= 0.01:
        return
        
    draw = ImageDraw.Draw(canvas, "RGBA")
    alpha = int(255 * alpha_factor)
    
    f_tag = get_font(16, bold=True)
    f_main = get_font(72, bold=True)
    
    b_tag = draw.textbbox((0, 0), tag_text, font=f_tag)
    w_tag = b_tag[2] - b_tag[0]
    
    b_main = draw.textbbox((0, 0), main_text, font=f_main)
    w_main = b_main[2] - b_main[0]
    
    content_w = max(w_tag, w_main)
    pad_x = 64
    box_w = min(W - 120, content_w + pad_x * 2)
    box_h = 136
    box_x = (W - box_w) // 2
    box_y = y_pos
    
    a_bg = int(235 * alpha_factor)
    a_border = int(45 * alpha_factor)
    
    # Obsidian glass pill
    draw.rounded_rectangle(
        [(box_x, box_y), (box_x + box_w, box_y + box_h)],
        radius=22,
        fill=(8, 11, 17, a_bg),
        outline=(255, 255, 255, a_border),
        width=1
    )
    
    # Left colored vertical accent pip
    draw.rounded_rectangle(
        [(box_x + 8, box_y + 16), (box_x + 13, box_y + box_h - 16)],
        radius=3,
        fill=tag_color + (alpha,)
    )
    
    # Tag
    draw.text(((W - w_tag)//2, box_y + 20), tag_text, font=f_tag, fill=tag_color + (int(alpha * 0.95),))
    
    # Main Headline
    tx = (W - w_main) // 2
    ty = box_y + 46
    draw.text((tx + 1, ty + 1), main_text, font=f_main, fill=(0, 0, 0, int(alpha * 0.85)))
    draw.text((tx, ty), main_text, font=f_main, fill=(255, 255, 255, alpha))

def calculate_fade(t_local, duration=5.0, fade_in=0.6, fade_out=0.6):
    if t_local < fade_in:
        return ease_out_cubic(t_local / fade_in)
    elif t_local > (duration - fade_out):
        return ease_out_cubic((duration - t_local) / fade_out)
    return 1.0

# -----------------------------------------------------------------------------
# SCENE 1 (0.0s – 5.0s): THEY STOP. (Brushed Steel + Dynamic Cyan Laser Sweep)
# -----------------------------------------------------------------------------
def render_scene1(t):
    p = t / 5.0
    scale = 1.0 + 0.06 * ease_in_out(p)
    steel_crop = cover_crop(IMG_STEEL, int(W * scale), int(H * scale))
    cw, ch = (steel_crop.width - W)//2, (steel_crop.height - H)//2
    base = steel_crop.crop((cw, ch, cw + W, ch + H))
    
    arr = np.array(base, dtype=np.float32)
    # Sweeping diagonal laser beam
    beam_x = -250 + (W + 500) * ease_in_out(p)
    beam_d = np.abs((x_coords - beam_x) + (y_coords - H*0.5) * 0.35)
    beam_i = np.exp(- (beam_d**2) / (120.0**2))
    arr[:, :, 1] += beam_i * 150.0  # Cyan green
    arr[:, :, 2] += beam_i * 255.0  # Cyan blue
    
    # Horizontal flare
    strk_d = np.abs(y_coords - (H * 0.48))
    strk = np.exp(- (strk_d**2) / (12.0**2)) * np.exp(- ((x_coords - beam_x)**2) / (600.0**2))
    arr[:, :, 1] += strk * 180.0
    arr[:, :, 2] += strk * 255.0
    
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    im = apply_cinematic_bars(im)
    
    fade = calculate_fade(t, duration=5.0, fade_in=0.5, fade_out=0.5)
    draw_luxury_headline(im, "01 // ATTENTION", "THEY STOP.", tag_color=C_CYAN, alpha_factor=fade)
    return im

# -----------------------------------------------------------------------------
# SCENE 2 (5.0s – 10.0s): THEY FEEL. (Warm Glowing Fluid Energy & Bokeh Ribbons)
# -----------------------------------------------------------------------------
def render_scene2(t):
    t_rel = t - 5.0
    p = t_rel / 5.0
    arr = np.zeros((H, W, 3), dtype=np.float32)
    
    # Deep obsidian vignette
    arr[:, :, 0] = 12.0 + 8.0 * (1.0 - np.clip(dist_c / 900.0, 0, 1))
    arr[:, :, 1] = 10.0 + 8.0 * (1.0 - np.clip(dist_c / 900.0, 0, 1))
    arr[:, :, 2] = 24.0 + 20.0 * (1.0 - np.clip(dist_c / 900.0, 0, 1))
    
    # Swirling fluid ribbons (Amber & Royal Blue)
    ang = p * math.pi * 2.0
    gx = cx + math.cos(ang) * 260
    gy = cy + math.sin(ang * 1.3) * 150
    bx = cx + math.cos(ang + math.pi) * 260
    by = cy + math.sin((ang + math.pi) * 1.3) * 150
    
    dg = np.sqrt((x_coords - gx)**2 + (y_coords - gy)**2)
    db = np.sqrt((x_coords - bx)**2 + (y_coords - by)**2)
    
    # Amber fluid
    arr[:, :, 0] += np.exp(- (dg**2) / (220.0**2)) * 255.0
    arr[:, :, 1] += np.exp(- (dg**2) / (220.0**2)) * 140.0
    arr[:, :, 2] += np.exp(- (dg**2) / (220.0**2)) * 25.0
    
    # Royal blue fluid
    arr[:, :, 0] += np.exp(- (db**2) / (220.0**2)) * 40.0
    arr[:, :, 1] += np.exp(- (db**2) / (220.0**2)) * 130.0
    arr[:, :, 2] += np.exp(- (db**2) / (220.0**2)) * 255.0
    
    # Golden living core
    arr[:, :, 0] += np.exp(- (dist_c**2) / (180.0**2)) * (200.0 + 30.0 * math.sin(p * 6.0))
    arr[:, :, 1] += np.exp(- (dist_c**2) / (180.0**2)) * (150.0 + 20.0 * math.sin(p * 6.0))
    arr[:, :, 2] += np.exp(- (dist_c**2) / (180.0**2)) * 70.0
    
    # Floating bokeh particles
    for i in range(16):
        px = cx + math.sin(p * 2.5 + i * 1.5) * 440
        py = cy + math.cos(p * 2.0 + i * 2.1) * 250
        d_p = np.sqrt((x_coords - px)**2 + (y_coords - py)**2)
        bglow = np.exp(- (d_p**2) / (32.0**2))
        arr[:, :, 0] += bglow * (240 if i % 2 == 0 else 60)
        arr[:, :, 1] += bglow * (150 if i % 2 == 0 else 140)
        arr[:, :, 2] += bglow * (30 if i % 2 == 0 else 240)
        
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    im = apply_cinematic_bars(im)
    
    fade = calculate_fade(t_rel, duration=5.0, fade_in=0.5, fade_out=0.5)
    draw_luxury_headline(im, "02 // EMOTION", "THEY FEEL.", tag_color=C_ACCENT, alpha_factor=fade)
    return im

# -----------------------------------------------------------------------------
# SCENE 3 (10.0s – 15.0s): THEY BELIEVE. (3D Holographic Glass Towers + Prisms)
# -----------------------------------------------------------------------------
def render_scene3(t):
    t_rel = t - 10.0
    p = t_rel / 5.0
    scale = 1.0 + 0.05 * ease_in_out(p)
    tower_crop = cover_crop(IMG_TOWERS, int(W * scale), int(H * scale))
    cw, ch = (tower_crop.width - W)//2, (tower_crop.height - H)//2
    base = tower_crop.crop((cw, ch, cw + W, ch + H))
    
    arr = np.array(base, dtype=np.float32)
    # Rotating laser prism rays
    rot = p * 0.8
    for k in range(6):
        ang = rot + k * (math.pi / 3.0)
        dx, dy = math.cos(ang), math.sin(ang)
        proj = (x_coords - cx) * dx + (y_coords - cy) * dy
        perp = np.abs(- (x_coords - cx) * dy + (y_coords - cy) * dx)
        mask = (proj > 0)
        ray = np.exp(- (perp**2) / (16.0**2)) * np.exp(- proj / 700.0) * mask
        col = C_MINT if k % 2 == 0 else C_CYAN
        arr[:, :, 0] += ray * col[0] * 0.85
        arr[:, :, 1] += ray * col[1] * 0.85
        arr[:, :, 2] += ray * col[2] * 0.85
        
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    im = apply_cinematic_bars(im)
    
    fade = calculate_fade(t_rel, duration=5.0, fade_in=0.5, fade_out=0.5)
    draw_luxury_headline(im, "03 // CERTAINTY", "THEY BELIEVE.", tag_color=C_MINT, alpha_factor=fade)
    return im

# -----------------------------------------------------------------------------
# SCENE 4 (15.0s – 20.0s): THEY CHOOSE YOU. (Holographic Matrix + Radiant Waves)
# -----------------------------------------------------------------------------
def render_scene4(t):
    t_rel = t - 15.0
    p = t_rel / 5.0
    
    scale = 1.0 + 0.05 * ease_in_out(p)
    mat_crop = cover_crop(IMG_MATRIX, int(W * scale), int(H * scale))
    cw, ch = (mat_crop.width - W)//2, (mat_crop.height - H)//2
    base = mat_crop.crop((cw, ch, cw + W, ch + H))
    
    arr = np.array(base, dtype=np.float32)
    
    # Expanding radiant shockwave rings
    for r in range(3):
        rad = ((p * 1.5 + r * 0.33) % 1.5) * (W * 0.55)
        d_ring = np.abs(dist_c - rad)
        i_ring = np.exp(- (d_ring**2) / (28.0**2)) * (1.0 - (rad / (W * 0.6)))
        arr[:, :, 0] += i_ring * 240.0
        arr[:, :, 1] += i_ring * 190.0
        arr[:, :, 2] += i_ring * 90.0
        
    # Central radiant bloom
    arr[:, :, 0] += np.exp(- (dist_c**2) / (240.0**2)) * 140.0
    arr[:, :, 1] += np.exp(- (dist_c**2) / (240.0**2)) * 160.0
    arr[:, :, 2] += np.exp(- (dist_c**2) / (240.0**2)) * 220.0
    
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    im = apply_cinematic_bars(im)
    
    # SEAMLESS LOOP CROSS-DISSOLVE (Last 1.5s -> Scene 1 opening frames)
    if t >= 18.5:
        loop_p = (t - 18.5) / 1.5
        im_start = render_scene1(t - 18.5)
        im = Image.blend(im, im_start, ease_in_out(loop_p))
        return im
        
    fade = calculate_fade(t_rel, duration=5.0, fade_in=0.5, fade_out=1.6)
    draw_luxury_headline(im, "04 // ACTION", "THEY CHOOSE YOU.", tag_color=C_GOLD, alpha_factor=fade)
    return im

def generate_frame(f_idx):
    t = f_idx / FPS
    if t < 5.0:
        return render_scene1(t)
    elif t < 10.0:
        return render_scene2(t)
    elif t < 15.0:
        return render_scene3(t)
    else:
        return render_scene4(t)

def main():
    print(f"=== Rendering InoConnect Psychology Hero Film ===")
    print(f"Total: {TOTAL_FRAMES} frames @ 1920x1080 30FPS ({TOTAL_SEC}s)")
    print(f"Closed-Ended Seamless Loop: 18.5s – 20.0s into 0.0s – 1.5s")
    
    ffmpeg_cmd = [
        FFMPEG,
        "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{W}x{H}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "17",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        RAW_MP4
    ]
    
    proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    storyboard_frames = [
        75,    # Scene 1 peak (2.5s)
        225,   # Scene 2 peak (7.5s)
        375,   # Scene 3 peak (12.5s)
        510,   # Scene 4 peak (17.0s)
        585    # Seamless loop seam (19.5s)
    ]
    saved_thumbs = []
    
    for f in range(TOTAL_FRAMES):
        frame = generate_frame(f)
        proc.stdin.write(frame.tobytes())
        
        if f in storyboard_frames:
            saved_thumbs.append(frame.copy())
            
        if f % 75 == 0:
            pct = (f / TOTAL_FRAMES) * 100
            print(f"  Frame {f}/{TOTAL_FRAMES} ({pct:.1f}%) rendered...")
            
    proc.stdin.close()
    proc.wait()
    print("Video stream finished. Muxing with seamless ambient audio loop...")
    
    # Mux with audio loop
    mux_cmd = [
        FFMPEG,
        "-y",
        "-i", RAW_MP4,
        "-i", AUDIO_LOOP,
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "256k",
        "-shortest",
        FINAL_MP4
    ]
    subprocess.run(mux_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Master film created: {FINAL_MP4}")
    
    # Copy to downloads
    shutil.copy2(FINAL_MP4, DOWNLOADS_COPY)
    print(f"Copied to downloads: {DOWNLOADS_COPY}")
    
    # Build Storyboard Contact Sheet
    print("Generating storyboard contact sheet...")
    sw, sh = 1920, 1080
    sheet = Image.new("RGB", (sw, sh), (8, 11, 17))
    s_draw = ImageDraw.Draw(sheet)
    
    s_draw.text((70, 45), "INOCONNECT // THE 4 BEATS OF CONSUMER PSYCHOLOGY", font=get_font(28, bold=True), fill=C_WHITE)
    s_draw.text((sw - 450, 48), "SEAMLESS CLOSED LOOP • 20.0s @ 1080P", font=get_font(16, bold=True), fill=C_CYAN)
    
    cols = 2
    tw, th = 860, 484
    coords = [
        (70, 100),
        (990, 100),
        (70, 560),
        (990, 560)
    ]
    labels = [
        "1. ATTENTION (THEY STOP.)",
        "2. EMOTION (THEY FEEL.)",
        "3. CERTAINTY (THEY BELIEVE.)",
        "4. ACTION (THEY CHOOSE YOU. -> SEAMLESS LOOP)"
    ]
    
    for i in range(min(4, len(saved_thumbs))):
        x, y = coords[i]
        t_img = saved_thumbs[i].resize((tw, th), Image.Resampling.LANCZOS)
        sheet.paste(t_img, (x, y))
        s_draw.rectangle([(x - 1, y - 1), (x + tw, y + th)], outline=(65, 105, 225, 90), width=1)
        s_draw.text((x, y - 26), labels[i], font=get_font(14, bold=True), fill=(226, 232, 240))
        
    sheet.save(STORYBOARD_JPG, quality=95)
    print(f"Updated storyboard saved: {STORYBOARD_JPG}")

if __name__ == "__main__":
    main()
