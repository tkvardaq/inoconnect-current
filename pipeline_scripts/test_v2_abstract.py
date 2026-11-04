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
IMG_SOCIAL = load_img("service_social_visualization_1766962344230.png")
IMG_DEV = load_img("service_webdev_visualization_1766962366202.png")
IMG_NEXUS = load_img("service_ppc_visualization_1766962268848.png")

C_CYAN = (0, 210, 255)
C_ACCENT = (255, 117, 24)
C_MINT = (68, 215, 168)
C_WHITE = (255, 255, 255)

def apply_cinematic_grade(im, contrast=1.2, warmth=1.0):
    arr = np.array(im, dtype=np.float32)
    arr[:, :, 0] = np.clip(arr[:, :, 0] * warmth, 0, 255)
    arr[:, :, 2] = np.clip(arr[:, :, 2] * (2.0 - warmth), 0, 255)
    mean = 128.0
    arr = np.clip((arr - mean) * contrast + mean, 0, 255)
    
    graded = Image.fromarray(arr.astype(np.uint8))
    draw = ImageDraw.Draw(graded, "RGBA")
    
    # 2.39:1 Cinema Letterbox
    bar_h = 56
    draw.rectangle([(0, 0), (W, bar_h)], fill=(8, 11, 17, 255))
    draw.rectangle([(0, H - bar_h), (W, H)], fill=(8, 11, 17, 255))
    draw.line([(0, bar_h), (W, bar_h)], fill=(65, 105, 225, 80), width=1)
    draw.line([(0, H - bar_h), (W, H - bar_h)], fill=(65, 105, 225, 80), width=1)
    return graded

def draw_hero_text(draw, tag_text, main_text, tag_color=C_CYAN, alpha=255):
    if alpha <= 0:
        return
        
    # Tag
    f_tag = get_font(18, bold=True)
    b_tag = draw.textbbox((0, 0), tag_text, font=f_tag)
    w_tag = b_tag[2] - b_tag[0]
    draw.text(((W - w_tag)//2, H//2 - 70), tag_text, font=f_tag, fill=tag_color + (int(alpha * 0.95),))
    
    # Main Headline
    f_main = get_font(102, bold=True)
    b_main = draw.textbbox((0, 0), main_text, font=f_main)
    w_main = b_main[2] - b_main[0]
    # Subtle drop shadow
    draw.text(((W - w_main)//2 + 2, H//2 - 20 + 2), main_text, font=f_main, fill=(0, 0, 0, int(alpha * 0.85)))
    draw.text(((W - w_main)//2, H//2 - 20), main_text, font=f_main, fill=(255, 255, 255, alpha))

# Render Beat 1 Test Frame
base1 = cover_crop(IMG_STEEL, W, H)
# Add dynamic sweeping cyan anamorphic flare
arr1 = np.array(base1, dtype=np.float32)
y_coords, x_coords = np.ogrid[:H, :W]
beam_dist = np.abs((x_coords - W*0.5) + (y_coords - H*0.5) * 0.3)
beam_intensity = np.exp(- (beam_dist**2) / (120.0**2))
arr1[:, :, 1] += beam_intensity * 120.0  # Green
arr1[:, :, 2] += beam_intensity * 200.0  # Blue
# Anamorphic streak
streak_dist = np.abs(y_coords - H*0.5)
streak = np.exp(- (streak_dist**2) / (15.0**2)) * np.exp(- ((x_coords - W*0.5)**2) / (500.0**2))
arr1[:, :, 1] += streak * 160.0
arr1[:, :, 2] += streak * 255.0
stage1 = apply_cinematic_grade(Image.fromarray(np.clip(arr1, 0, 255).astype(np.uint8)), contrast=1.22)
d1 = ImageDraw.Draw(stage1, "RGBA")
draw_hero_text(d1, "01 // ATTENTION", "THEY STOP.", tag_color=C_CYAN)
stage1.save(os.path.join(OUT_DIR, "v2_beat1.jpg"), quality=95)

# Render Beat 2 Test Frame
base2 = cover_crop(IMG_SOCIAL, W, H)
arr2 = np.array(base2, dtype=np.float32)
# Warm amber glow bloom
dist_c = np.sqrt((x_coords - W*0.5)**2 + (y_coords - H*0.5)**2)
glow = np.exp(- (dist_c**2) / (320.0**2))
arr2[:, :, 0] += glow * 180.0
arr2[:, :, 1] += glow * 90.0
stage2 = apply_cinematic_grade(Image.fromarray(np.clip(arr2, 0, 255).astype(np.uint8)), contrast=1.25, warmth=1.05)
d2 = ImageDraw.Draw(stage2, "RGBA")
draw_hero_text(d2, "02 // EMOTION", "THEY FEEL.", tag_color=C_ACCENT)
stage2.save(os.path.join(OUT_DIR, "v2_beat2.jpg"), quality=95)

# Render Beat 3 Test Frame
base3 = cover_crop(IMG_DEV, W, H)
arr3 = np.array(base3, dtype=np.float32)
# Cyan/Mint refractive prism sweep
streak_dist = np.abs(y_coords - H*0.48)
streak3 = np.exp(- (streak_dist**2) / (25.0**2))
arr3[:, :, 1] += streak3 * 140.0
arr3[:, :, 2] += streak3 * 180.0
stage3 = apply_cinematic_grade(Image.fromarray(np.clip(arr3, 0, 255).astype(np.uint8)), contrast=1.20)
d3 = ImageDraw.Draw(stage3, "RGBA")
draw_hero_text(d3, "03 // CERTAINTY", "THEY BELIEVE.", tag_color=C_MINT)
stage3.save(os.path.join(OUT_DIR, "v2_beat3.jpg"), quality=95)

# Render Beat 4 Test Frame
base4 = cover_crop(IMG_NEXUS, W, H)
arr4 = np.array(base4, dtype=np.float32)
# Expanding shockwave pulse
ring_dist = np.abs(dist_c - 400.0)
pulse = np.exp(- (ring_dist**2) / (35.0**2))
arr4[:, :, 0] += pulse * 255.0
arr4[:, :, 1] += pulse * 180.0
arr4[:, :, 2] += pulse * 60.0
stage4 = apply_cinematic_grade(Image.fromarray(np.clip(arr4, 0, 255).astype(np.uint8)), contrast=1.25, warmth=1.04)
d4 = ImageDraw.Draw(stage4, "RGBA")
draw_hero_text(d4, "04 // ACTION", "THEY CHOOSE YOU.", tag_color=(255, 255, 255))
stage4.save(os.path.join(OUT_DIR, "v2_beat4.jpg"), quality=95)

# Contact sheet
contact = Image.new("RGB", (1920, 1080), (8, 11, 17))
tw, th = 880, 495
contact.paste(stage1.resize((tw, th)), (50, 30))
contact.paste(stage2.resize((tw, th)), (990, 30))
contact.paste(stage3.resize((tw, th)), (50, 555))
contact.paste(stage4.resize((tw, th)), (990, 555))
contact.save(os.path.join(OUT_DIR, "v2_contact.jpg"), quality=95)

print("V2 Test frames generated successfully!")
