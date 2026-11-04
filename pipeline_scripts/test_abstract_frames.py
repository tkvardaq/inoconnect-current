import math
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

W, H = 1920, 1080
FPS = 30
OUT_DIR = r"d:\ino website\videos\test_frames"
os.makedirs(OUT_DIR, exist_ok=True)
FONT_PATH = r"D:\videos for reels\fonts\Outfit-Variable.ttf"

# Colors
C_DARK = (8, 11, 17)
C_PRIMARY = (65, 105, 225)
C_ACCENT = (255, 117, 24)
C_MINT = (68, 215, 168)
C_CYAN = (0, 210, 255)
C_GOLD = (255, 190, 70)
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

def ease_in_out(x):
    return 0.5 - math.cos(math.pi * x) / 2

def ease_out_cubic(x):
    return 1 - math.pow(1 - x, 3)

# 1. Beat 1 Generator: Obsidian Glass + Iridescent Light Sweep ("THEY STOP.")
def render_beat1(t):
    # t in [0.0, 5.0]
    p = t / 5.0
    arr = np.zeros((H, W, 3), dtype=np.float32)
    
    # Base dark gradient
    y_coords, x_coords = np.ogrid[:H, :W]
    cx, cy = W * 0.5, H * 0.5
    dist = np.sqrt((x_coords - cx)**2 + (y_coords - cy)**2) / (W * 0.7)
    
    # Deep obsidian with vignette
    arr[:, :, 0] = 8.0 + 8.0 * (1.0 - np.clip(dist, 0, 1))
    arr[:, :, 1] = 11.0 + 12.0 * (1.0 - np.clip(dist, 0, 1))
    arr[:, :, 2] = 18.0 + 28.0 * (1.0 - np.clip(dist, 0, 1))
    
    # Sweeping Anamorphic Light Beam (travels from left to right)
    beam_x = -300 + (W + 600) * ease_in_out(min(1.0, p * 1.3))
    beam_dist = np.abs((x_coords - beam_x) + (y_coords - H*0.5) * 0.35)
    beam_intensity = np.exp(- (beam_dist**2) / (180.0**2))
    
    # Cyan/Royal Blue flare
    arr[:, :, 0] += beam_intensity * 30.0    # Blue
    arr[:, :, 1] += beam_intensity * 160.0   # Cyan
    arr[:, :, 2] += beam_intensity * 240.0
    
    # Horizontal anamorphic streak
    streak_dist = np.abs(y_coords - (H * 0.52))
    streak_intensity = np.exp(- (streak_dist**2) / (25.0**2)) * np.exp(- ((x_coords - beam_x)**2) / (600.0**2))
    arr[:, :, 0] += streak_intensity * 80.0
    arr[:, :, 1] += streak_intensity * 200.0
    arr[:, :, 2] += streak_intensity * 255.0
    
    # Crystalline glass refraction facets (geometric polygon caustics)
    for i in range(5):
        fx = (W * 0.3 + i * 260 + math.sin(p * 2.0 + i) * 60)
        fy = (H * 0.4 + math.cos(p * 2.5 + i) * 80)
        f_dist = np.sqrt((x_coords - fx)**2 + (y_coords - fy)**2)
        f_glow = np.exp(- (f_dist**2) / (140.0**2))
        arr[:, :, 0] += f_glow * 20.0
        arr[:, :, 1] += f_glow * 50.0
        arr[:, :, 2] += f_glow * 110.0
        
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    im = Image.fromarray(arr)
    
    # Draw Minimal Typography
    draw = ImageDraw.Draw(im, "RGBA")
    
    # Letterbox Cinema Bars
    draw.rectangle([(0, 0), (W, 56)], fill=(8, 11, 17, 255))
    draw.rectangle([(0, H - 56), (W, H)], fill=(8, 11, 17, 255))
    draw.line([(0, 56), (W, 56)], fill=(65, 105, 225, 90), width=1)
    draw.line([(0, H - 56), (W, H - 56)], fill=(65, 105, 225, 90), width=1)
    
    # Text Fade
    text_fade = 1.0
    if p < 0.15:
        text_fade = p / 0.15
    elif p > 0.85:
        text_fade = (1.0 - p) / 0.15
    a_txt = int(255 * text_fade)
    
    if a_txt > 0:
        f_tag = get_font(18, bold=True)
        tag = "01 // ATTENTION"
        b_tag = draw.textbbox((0, 0), tag, font=f_tag)
        w_tag = b_tag[2] - b_tag[0]
        draw.text(((W - w_tag)//2, H//2 - 90), tag, font=f_tag, fill=C_CYAN + (int(a_txt * 0.9),))
        
        f_main = get_font(96, bold=True)
        main_txt = "THEY STOP."
        b_main = draw.textbbox((0, 0), main_txt, font=f_main)
        w_main = b_main[2] - b_main[0]
        # Soft shadow
        draw.text(((W - w_main)//2 + 2, H//2 - 40 + 2), main_txt, font=f_main, fill=(0, 0, 0, int(a_txt * 0.8)))
        draw.text(((W - w_main)//2, H//2 - 40), main_txt, font=f_main, fill=(255, 255, 255, a_txt))
        
        # Sub-cue
        f_sub = get_font(20, bold=False)
        sub_txt = "Pattern Interrupt • The Subconscious Hook"
        b_sub = draw.textbbox((0, 0), sub_txt, font=f_sub)
        w_sub = b_sub[2] - b_sub[0]
        draw.text(((W - w_sub)//2, H//2 + 80), sub_txt, font=f_sub, fill=(180, 205, 240, int(a_txt * 0.75)))

    return im

# 2. Beat 2 Generator: Warm Gold & Royal Blue Fluid Swirl ("THEY FEEL.")
def render_beat2(t):
    # t in [5.0, 10.0]
    p = (t - 5.0) / 5.0
    arr = np.zeros((H, W, 3), dtype=np.float32)
    
    y_coords, x_coords = np.ogrid[:H, :W]
    cx, cy = W * 0.5, H * 0.5
    
    # Ambient deep violet/blue base
    arr[:, :, 0] = 12.0
    arr[:, :, 1] = 10.0
    arr[:, :, 2] = 24.0
    
    # Two orbiting fluid energy streams (Gold & Royal Blue)
    angle = p * math.pi * 2.0
    # Gold stream
    gx = cx + math.cos(angle) * (260 * (1.0 - p * 0.2))
    gy = cy + math.sin(angle * 1.2) * 160
    # Blue stream
    bx = cx + math.cos(angle + math.pi) * (260 * (1.0 - p * 0.2))
    by = cy + math.sin((angle + math.pi) * 1.2) * 160
    
    # Distances
    dist_g = np.sqrt((x_coords - gx)**2 + (y_coords - gy)**2)
    dist_b = np.sqrt((x_coords - bx)**2 + (y_coords - by)**2)
    dist_c = np.sqrt((x_coords - cx)**2 + (y_coords - cy)**2)
    
    # Gold glow
    glow_g = np.exp(- (dist_g**2) / (220.0**2))
    arr[:, :, 0] += glow_g * 255.0  # R
    arr[:, :, 1] += glow_g * 140.0  # G
    arr[:, :, 2] += glow_g * 25.0   # B
    
    # Blue glow
    glow_b = np.exp(- (dist_b**2) / (220.0**2))
    arr[:, :, 0] += glow_b * 40.0   # R
    arr[:, :, 1] += glow_b * 110.0  # G
    arr[:, :, 2] += glow_b * 255.0  # B
    
    # Central fusion core
    glow_c = np.exp(- (dist_c**2) / (180.0**2)) * (0.4 + 0.3 * math.sin(p * 6.0))
    arr[:, :, 0] += glow_c * 240.0
    arr[:, :, 1] += glow_c * 170.0
    arr[:, :, 2] += glow_c * 120.0
    
    # Floating bokeh particles
    for i in range(12):
        px = (cx + math.sin(p * 3.0 + i * 1.7) * 450)
        py = (cy + math.cos(p * 2.5 + i * 2.3) * 260)
        p_dist = np.sqrt((x_coords - px)**2 + (y_coords - py)**2)
        p_glow = np.exp(- (p_dist**2) / (45.0**2))
        arr[:, :, 0] += p_glow * (200 if i % 2 == 0 else 40)
        arr[:, :, 1] += p_glow * (130 if i % 2 == 0 else 140)
        arr[:, :, 2] += p_glow * (30 if i % 2 == 0 else 240)
        
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    im = Image.fromarray(arr)
    
    draw = ImageDraw.Draw(im, "RGBA")
    draw.rectangle([(0, 0), (W, 56)], fill=(8, 11, 17, 255))
    draw.rectangle([(0, H - 56), (W, H)], fill=(8, 11, 17, 255))
    draw.line([(0, 56), (W, 56)], fill=(255, 117, 24, 90), width=1)
    draw.line([(0, H - 56), (W, H - 56)], fill=(255, 117, 24, 90), width=1)
    
    text_fade = 1.0
    if p < 0.15:
        text_fade = p / 0.15
    elif p > 0.85:
        text_fade = (1.0 - p) / 0.15
    a_txt = int(255 * text_fade)
    
    if a_txt > 0:
        f_tag = get_font(18, bold=True)
        tag = "02 // EMOTION"
        b_tag = draw.textbbox((0, 0), tag, font=f_tag)
        w_tag = b_tag[2] - b_tag[0]
        draw.text(((W - w_tag)//2, H//2 - 90), tag, font=f_tag, fill=C_ACCENT + (int(a_txt * 0.95),))
        
        f_main = get_font(96, bold=True)
        main_txt = "THEY FEEL."
        b_main = draw.textbbox((0, 0), main_txt, font=f_main)
        w_main = b_main[2] - b_main[0]
        draw.text(((W - w_main)//2 + 2, H//2 - 40 + 2), main_txt, font=f_main, fill=(0, 0, 0, int(a_txt * 0.8)))
        draw.text(((W - w_main)//2, H//2 - 40), main_txt, font=f_main, fill=(255, 255, 255, a_txt))
        
        f_sub = get_font(20, bold=False)
        sub_txt = "Identity Mirroring • Subconscious Desire"
        b_sub = draw.textbbox((0, 0), sub_txt, font=f_sub)
        w_sub = b_sub[2] - b_sub[0]
        draw.text(((W - w_sub)//2, H//2 + 80), sub_txt, font=f_sub, fill=(255, 220, 180, int(a_txt * 0.75)))

    return im

# 3. Beat 3 Generator: Precision Crystal Prism + Refractive Laser Beams ("THEY BELIEVE.")
def render_beat3(t):
    # t in [10.0, 15.0]
    p = (t - 10.0) / 5.0
    arr = np.zeros((H, W, 3), dtype=np.float32)
    
    y_coords, x_coords = np.ogrid[:H, :W]
    cx, cy = W * 0.5, H * 0.5
    
    # Deep obsidian emerald/teal base
    arr[:, :, 0] = 7.0
    arr[:, :, 1] = 16.0
    arr[:, :, 2] = 20.0
    
    # 3D Rotating Geometric Crystal Facets
    rot = p * 0.8
    # Refractive Prism Beams
    for k in range(6):
        ray_ang = rot + k * (math.pi / 3.0)
        # Laser ray vector
        dx = math.cos(ray_ang)
        dy = math.sin(ray_ang)
        # Projection of point onto ray
        proj = (x_coords - cx) * dx + (y_coords - cy) * dy
        perp = np.abs(- (x_coords - cx) * dy + (y_coords - cy) * dx)
        
        ray_mask = (proj > 0)
        ray_intensity = np.exp(- (perp**2) / (18.0**2)) * np.exp(- (proj) / 700.0) * ray_mask
        
        col = C_MINT if k % 2 == 0 else C_CYAN
        arr[:, :, 0] += ray_intensity * col[0] * 0.9
        arr[:, :, 1] += ray_intensity * col[1] * 0.9
        arr[:, :, 2] += ray_intensity * col[2] * 0.9
        
    # Central crystal core
    dist_c = np.sqrt((x_coords - cx)**2 + (y_coords - cy)**2)
    core_glow = np.exp(- (dist_c**2) / (140.0**2)) * 1.2
    arr[:, :, 0] += core_glow * 90.0
    arr[:, :, 1] += core_glow * 255.0
    arr[:, :, 2] += core_glow * 220.0
    
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    im = Image.fromarray(arr)
    
    draw = ImageDraw.Draw(im, "RGBA")
    draw.rectangle([(0, 0), (W, 56)], fill=(8, 11, 17, 255))
    draw.rectangle([(0, H - 56), (W, H)], fill=(8, 11, 17, 255))
    draw.line([(0, 56), (W, 56)], fill=(68, 215, 168, 90), width=1)
    draw.line([(0, H - 56), (W, H - 56)], fill=(68, 215, 168, 90), width=1)
    
    text_fade = 1.0
    if p < 0.15:
        text_fade = p / 0.15
    elif p > 0.85:
        text_fade = (1.0 - p) / 0.15
    a_txt = int(255 * text_fade)
    
    if a_txt > 0:
        f_tag = get_font(18, bold=True)
        tag = "03 // CERTAINTY"
        b_tag = draw.textbbox((0, 0), tag, font=f_tag)
        w_tag = b_tag[2] - b_tag[0]
        draw.text(((W - w_tag)//2, H//2 - 90), tag, font=f_tag, fill=C_MINT + (int(a_txt * 0.95),))
        
        f_main = get_font(96, bold=True)
        main_txt = "THEY BELIEVE."
        b_main = draw.textbbox((0, 0), main_txt, font=f_main)
        w_main = b_main[2] - b_main[0]
        draw.text(((W - w_main)//2 + 2, H//2 - 40 + 2), main_txt, font=f_main, fill=(0, 0, 0, int(a_txt * 0.8)))
        draw.text(((W - w_main)//2, H//2 - 40), main_txt, font=f_main, fill=(255, 255, 255, a_txt))
        
        f_sub = get_font(20, bold=False)
        sub_txt = "Trust Architecture • Frictionless Conviction"
        b_sub = draw.textbbox((0, 0), sub_txt, font=f_sub)
        w_sub = b_sub[2] - b_sub[0]
        draw.text(((W - w_sub)//2, H//2 + 80), sub_txt, font=f_sub, fill=(180, 240, 215, int(a_txt * 0.75)))

    return im

# 4. Beat 4 Generator: Harmonic Radiant Expansion & Seamless Loop ("THEY CHOOSE YOU.")
def render_beat4(t):
    # t in [15.0, 20.0]
    p = (t - 15.0) / 5.0
    arr = np.zeros((H, W, 3), dtype=np.float32)
    
    y_coords, x_coords = np.ogrid[:H, :W]
    cx, cy = W * 0.5, H * 0.5
    
    # Ambient base
    arr[:, :, 0] = 9.0
    arr[:, :, 1] = 12.0
    arr[:, :, 2] = 22.0
    
    # Expanding concentric harmonic shockwaves
    dist_c = np.sqrt((x_coords - cx)**2 + (y_coords - cy)**2)
    
    for ring in range(3):
        r_radius = ((p * 1.5 + ring * 0.3) % 1.5) * (W * 0.6)
        r_dist = np.abs(dist_c - r_radius)
        r_intensity = np.exp(- (r_dist**2) / (40.0**2)) * (1.0 - (r_radius / (W * 0.7)))
        arr[:, :, 0] += np.clip(r_intensity, 0, 1) * 230.0
        arr[:, :, 1] += np.clip(r_intensity, 0, 1) * 160.0
        arr[:, :, 2] += np.clip(r_intensity, 0, 1) * 255.0
        
    # Central radiant bloom
    bloom = np.exp(- (dist_c**2) / (260.0**2)) * (0.8 + 0.2 * math.cos(p * 4.0))
    arr[:, :, 0] += bloom * 180.0
    arr[:, :, 1] += bloom * 190.0
    arr[:, :, 2] += bloom * 255.0
    
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    im = Image.fromarray(arr)
    
    # Seamless Loop Blend (from 18.5s to 20.0s -> Act 1 opening frames)
    if t >= 18.5:
        loop_p = (t - 18.5) / 1.5
        im_start = render_beat1(t - 18.5)
        im = Image.blend(im, im_start, ease_in_out(loop_p))
        return im
        
    draw = ImageDraw.Draw(im, "RGBA")
    draw.rectangle([(0, 0), (W, 56)], fill=(8, 11, 17, 255))
    draw.rectangle([(0, H - 56), (W, H)], fill=(8, 11, 17, 255))
    draw.line([(0, 56), (W, 56)], fill=(255, 255, 255, 90), width=1)
    draw.line([(0, H - 56), (W, H - 56)], fill=(255, 255, 255, 90), width=1)
    
    text_fade = 1.0
    if p < 0.15:
        text_fade = p / 0.15
    elif p > 0.70:
        text_fade = max(0.0, (0.85 - p) / 0.15)
    a_txt = int(255 * text_fade)
    
    if a_txt > 0:
        f_tag = get_font(18, bold=True)
        tag = "04 // ACTION"
        b_tag = draw.textbbox((0, 0), tag, font=f_tag)
        w_tag = b_tag[2] - b_tag[0]
        draw.text(((W - w_tag)//2, H//2 - 90), tag, font=f_tag, fill=(255, 255, 255, int(a_txt * 0.95)))
        
        f_main = get_font(96, bold=True)
        main_txt = "THEY CHOOSE YOU."
        b_main = draw.textbbox((0, 0), main_txt, font=f_main)
        w_main = b_main[2] - b_main[0]
        draw.text(((W - w_main)//2 + 2, H//2 - 40 + 2), main_txt, font=f_main, fill=(0, 0, 0, int(a_txt * 0.8)))
        draw.text(((W - w_main)//2, H//2 - 40), main_txt, font=f_main, fill=(255, 255, 255, a_txt))
        
        f_sub = get_font(20, bold=False)
        sub_txt = "Compounding Conversion • Lifelong Advocates"
        b_sub = draw.textbbox((0, 0), sub_txt, font=f_sub)
        w_sub = b_sub[2] - b_sub[0]
        draw.text(((W - w_sub)//2, H//2 + 80), sub_txt, font=f_sub, fill=(230, 240, 255, int(a_txt * 0.75)))

    return im

# Test 4 key timestamps
f1 = render_beat1(2.5)
f1.save(os.path.join(OUT_DIR, "beat1_test.jpg"), quality=95)

f2 = render_beat2(7.5)
f2.save(os.path.join(OUT_DIR, "beat2_test.jpg"), quality=95)

f3 = render_beat3(12.5)
f3.save(os.path.join(OUT_DIR, "beat3_test.jpg"), quality=95)

f4 = render_beat4(17.0)
f4.save(os.path.join(OUT_DIR, "beat4_test.jpg"), quality=95)

# Contact sheet
contact = Image.new("RGB", (1920, 1080), (8, 11, 17))
tw, th = 880, 495
contact.paste(f1.resize((tw, th)), (50, 30))
contact.paste(f2.resize((tw, th)), (990, 30))
contact.paste(f3.resize((tw, th)), (50, 555))
contact.paste(f4.resize((tw, th)), (990, 555))
contact.save(os.path.join(OUT_DIR, "contact_test.jpg"), quality=95)

print("Test frames and contact sheet generated successfully!")
