"""
InoConnect — Disruptive Advertising-Style Homepage Hero Video Generator (Funky + Professional Edition)
Aspect Ratio: 16:9 Widescreen (1920x1080)
Duration: 36.0 seconds (1080 frames @ 30 FPS)
Audio: 48kHz Mastered Deep Urban House Groove (Driving beats, energetic funk + commercial swagger)

Key "Funky + Professional" Enhancements:
1. Dynamic Top Stepper Navigation Bar with live illuminated service indicators (01 PPC -> 08 STRATEGY)
2. Asymmetrical & Diverse Layouts: Center Power Hook, Left Cyber HUD, Right Glass Bento, Bottom Tech Dock
3. Reticle Corner Marks [ + ], Monospace metadata tags (// SYS.ACT, // 01_PPC), and glowing border accents
4. High-contrast Neon Electric Color Palette (Electric Orange #FF7518, Neon Mint #00F5A0, Cyber Cyan #00D2FF)
5. Multi-badge live metric tickers (+340% ROAS, <1.2s RESPONSE, 0.4s SPEED, 0% FLUFF)
6. Rapid dual-clip climax cut synced to kick-drums (thermal printer -> delivery)
7. High-converting Disruptive-style final End Card with dual gradient aura and action button
"""

import os
import glob
import subprocess
import shutil
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
W, H = 1920, 1080
FPS = 30
TOTAL_SEC = 36.0
TOTAL_FRAMES = int(TOTAL_SEC * FPS)  # 1080 frames

STOCK_DIR = r"D:\videos for reels\stock\clips"
VID_DIR = r"D:\videos for reels"
IMG_DIR = r"d:\ino website\images"
FONT_PATH = r"D:\videos for reels\fonts\Outfit-Variable.ttf"
LOGO_PATH = r"d:\ino website\logo.png"
SOUNDTRACK_WAV = r"D:\videos for reels\stock\funky_hero_audio_36s.wav"

OUT_DIR = r"d:\ino website\videos"
os.makedirs(OUT_DIR, exist_ok=True)
RAW_MP4 = os.path.join(OUT_DIR, "hero_funky_raw.mp4")
FINAL_MP4 = os.path.join(OUT_DIR, "inoconnect-hero-showreel.mp4")
DOWNLOADS_COPY = r"C:\Users\talha\Downloads\InoConnect_Hero_Showreel.mp4"
STORYBOARD_JPG = os.path.join(OUT_DIR, "inoconnect_hero_storyboard.jpg")


def find_file(pattern, fallback=None):
    matches = glob.glob(pattern)
    if matches:
        return matches[0]
    return fallback


def stock_clip(vid_id):
    for q in (720, 1080):
        p = os.path.join(STOCK_DIR, f"{vid_id}-{q}.mp4")
        if os.path.exists(p):
            return p
    return None


def load_font(size, weight=700):
    if os.path.exists(FONT_PATH):
        try:
            f = ImageFont.truetype(FONT_PATH, size)
            f.set_variation_by_axes([weight])
            return f
        except Exception:
            return ImageFont.truetype(FONT_PATH, size)
    return ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", size)


def load_mono(size):
    for p in [r"C:\Windows\Fonts\consola.ttf", r"C:\Windows\Fonts\lucon.ttf"]:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return load_font(size, 700)


# Typography Hierarchy
F_TOP_BRAND = load_font(19, 800)
F_STEP_PILL = load_font(13, 800)
F_TAG_MONO  = load_mono(16)
F_HEAD_XL   = load_font(56, 900)
F_HEAD_L    = load_font(46, 800)
F_SUB_L     = load_font(34, 700)
F_PILL_TXT  = load_font(21, 700)

F_END_LOGO  = load_font(76, 900)
F_END_SUB   = load_font(26, 800)
F_END_BTN   = load_font(30, 800)
F_END_URL   = load_font(23, 600)

WHITE        = (255, 255, 255)
OFF_WHITE    = (230, 238, 250)
NEON_ORANGE  = (255, 95, 0)     # Electric Orange
INOCON_ORANGE= (255, 117, 24)   # Official InoConnect Orange
NEON_MINT    = (0, 245, 160)    # Electric Mint #00F5A0
CYBER_CYAN   = (0, 210, 255)    # Cyber Cyan
ROYAL_BLUE   = (67, 97, 238)    # Royal Blue
DARK_OBSIDIAN= (10, 15, 26)     # Deep Glass Base


class FootageSource:
    """Manages loading, scaling, and Ken-Burns animation for both video and still clips."""
    def __init__(self):
        self.video_caps = {}
        self.images = {}
        # Punchy Cinema color grade LUT with rich deep blacks and luminous midtones
        x = np.arange(256, dtype=np.float32) / 255.0
        s_curve = 0.5 + 0.5 * np.tanh(2.3 * (x - 0.48))
        s_curve = (s_curve - s_curve.min()) / (s_curve.max() - s_curve.min())
        self.lut = np.clip(x * 0.55 + s_curve * 0.45, 0.0, 1.0)
        self.lut_u8 = (self.lut * 255.0).astype(np.uint8)

        # Scrim with subtle top bar and dynamic bottom shadow
        scrim = np.zeros((H, W, 4), dtype=np.uint8)
        for y in range(140):
            alpha = int(180 * (1.0 - y / 140.0))
            scrim[y, :, :] = [8, 12, 22, alpha]
        for y in range(620, H):
            prog = (y - 620) / float(H - 620)
            alpha = int(225 * (prog ** 1.25))
            scrim[y, :, :] = [6, 10, 20, alpha]
        self.scrim_img = Image.fromarray(scrim, mode="RGBA")

    def grade(self, rgb_np):
        graded = cv2.LUT(rgb_np, self.lut_u8)
        f = graded.astype(np.float32)
        f[:, :, 0] = np.clip(f[:, :, 0] * 1.02, 0, 255)
        f[:, :, 2] = np.clip(f[:, :, 2] * 0.98 + 1.0, 0, 255)
        return f.astype(np.uint8)

    def get_frame(self, path, frame_idx, scene_start_frame, scene_total_frames, is_image=False, pan_dir="right"):
        if is_image:
            if path not in self.images:
                im = Image.open(path).convert("RGB")
                self.images[path] = im
            im = self.images[path]
            iw, ih = im.size
            progress = (frame_idx - scene_start_frame) / max(1, scene_total_frames)
            scale = 1.06 + 0.14 * progress
            tgt_ar = W / H
            crop_w = int(min(iw, ih * tgt_ar) / scale)
            crop_h = int(min(ih, iw / tgt_ar) / scale)

            if pan_dir == "right":
                cx = int((iw - crop_w) * (0.15 + 0.7 * progress))
                cy = int((ih - crop_h) * 0.5)
            elif pan_dir == "zoom_in":
                cx = int((iw - crop_w) * 0.5)
                cy = int((ih - crop_h) * (0.4 + 0.25 * progress))
            else:
                cx = int((iw - crop_w) * (0.85 - 0.7 * progress))
                cy = int((ih - crop_h) * 0.5)

            cx = max(0, min(cx, iw - crop_w))
            cy = max(0, min(cy, ih - crop_h))

            cropped = im.crop((cx, cy, cx + crop_w, cy + crop_h)).resize((W, H), Image.Resampling.LANCZOS)
            return self.grade(np.array(cropped))

        # Video
        if path not in self.video_caps:
            cap = cv2.VideoCapture(path)
            self.video_caps[path] = cap
        cap = self.video_caps[path]

        rel_frame = frame_idx - scene_start_frame
        fps_in = cap.get(cv2.CAP_PROP_FPS) or 24.0
        total_in = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 100)
        target_in_frame = int((rel_frame / FPS) * fps_in) % max(1, total_in - 5)

        cap.set(cv2.CAP_PROP_POS_FRAMES, target_in_frame)
        ret, frame_bgr = cap.read()
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ret, frame_bgr = cap.read()
            if not ret:
                return np.full((H, W, 3), 12, dtype=np.uint8)

        frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
        fh, fw = frame_rgb.shape[:2]

        src_ar = fw / fh
        tgt_ar = W / H
        if abs(src_ar - tgt_ar) < 0.02:
            resized = cv2.resize(frame_rgb, (W, H), interpolation=cv2.INTER_LINEAR)
        elif src_ar > tgt_ar:
            new_w = int(fh * tgt_ar)
            x_off = (fw - new_w) // 2
            cropped = frame_rgb[:, x_off:x_off + new_w]
            resized = cv2.resize(cropped, (W, H), interpolation=cv2.INTER_LINEAR)
        else:
            new_h = int(fw / tgt_ar)
            y_off = (fh - new_h) // 2
            cropped = frame_rgb[y_off:y_off + new_h, :]
            resized = cv2.resize(cropped, (W, H), interpolation=cv2.INTER_LINEAR)

        return self.grade(resized)


# Logo cache
_LOGO_RGBA = None
def get_logo(size=80):
    global _LOGO_RGBA
    if _LOGO_RGBA is None and os.path.exists(LOGO_PATH):
        im = Image.open(LOGO_PATH).convert("RGBA")
        _LOGO_RGBA = im
    if _LOGO_RGBA:
        return _LOGO_RGBA.resize((size, size), Image.Resampling.LANCZOS)
    return None


SERVICE_STEPS = ["PPC", "SEO", "AI AUTO", "AI DEV", "WEB DEV", "CREATIVE", "SOCIAL", "STRATEGY"]


def draw_tech_corners(draw, x, y, w, h, col=(255, 255, 255, 100), s=10):
    """Draws sleek cyber reticle corner marks [+] on cards."""
    # Top-Left
    draw.line([(x, y + s), (x, y), (x + s, y)], fill=col, width=2)
    # Top-Right
    draw.line([(x + w - s, y), (x + w, y), (x + w, y + s)], fill=col, width=2)
    # Bottom-Left
    draw.line([(x, y + h - s), (x, y + h), (x + s, y + h)], fill=col, width=2)
    # Bottom-Right
    draw.line([(x + w - s, y + h), (x + w, y + h), (x + w, y + h - s)], fill=col, width=2)


def draw_top_navigation_bar(draw, active_idx=None):
    """Draws the dynamic top HUD bar with brand logo & animated active service pills."""
    # Top dark glass bar
    draw.rounded_rectangle([70, 36, W - 70, 92], radius=16, fill=(12, 18, 30, 210), outline=(255, 255, 255, 30), width=1)
    
    # Left Brand Mark
    draw.text((105, 52), "INOCONNECT", font=F_TOP_BRAND, fill=(255, 255, 255, 250))
    draw.text((230, 52), "•", font=F_TOP_BRAND, fill=NEON_ORANGE + (255,))
    draw.text((246, 54), "GROWTH HUD", font=load_mono(14), fill=(140, 160, 190, 210))

    # Stepper Pills Center
    step_start_x = 420
    pill_w = 95
    pill_gap = 10

    for i, sname in enumerate(SERVICE_STEPS):
        px = step_start_x + i * (pill_w + pill_gap)
        py = 48
        is_active = (active_idx == i)
        is_all_active = (active_idx == -1)  # Climax scene: all illuminate!

        if is_active or is_all_active:
            fill_col = (NEON_ORANGE + (220,)) if (i % 2 == 0) else (NEON_MINT + (220,))
            txt_col = (255, 255, 255, 255) if (i % 2 == 0) else (10, 20, 20, 255)
            draw.rounded_rectangle([px, py, px + pill_w, py + 32], radius=8, fill=fill_col)
            # Underline glow
            draw.line([(px + 4, py + 34), (px + pill_w - 4, py + 34)], fill=WHITE, width=2)
        else:
            fill_col = (20, 28, 45, 140)
            txt_col = (140, 155, 180, 200)
            draw.rounded_rectangle([px, py, px + pill_w, py + 32], radius=8, fill=fill_col, outline=(255, 255, 255, 20), width=1)

        bbox = draw.textbbox((0, 0), sname, font=F_STEP_PILL)
        tw = bbox[2] - bbox[0]
        draw.text((px + (pill_w - tw) // 2, py + 7), sname, font=F_STEP_PILL, fill=txt_col)

    # Right live pulse
    rx = W - 260
    draw.ellipse([rx, 58, rx + 10, 68], fill=NEON_MINT + (255,))
    draw.text((rx + 18, 54), "LIVE SHOWREEL", font=load_mono(13), fill=(230, 240, 255, 230))


def draw_funky_overlay(base_rgb, scene_meta, frame_in_scene, total_scene_frames):
    """Draws asymmetrical, funky, dynamic editorial HUD cards with vibrant tech graphics."""
    im = Image.fromarray(base_rgb).convert("RGBA")
    im.alpha_composite(SOURCE_ENGINE.scrim_img)

    txt_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(txt_layer)

    # 1. Top HUD Navigation Bar
    draw_top_navigation_bar(draw, active_idx=scene_meta.get("active_step", None))

    # Fast kinetic entry animation
    ease = 1.0
    if frame_in_scene < 9:
        t = frame_in_scene / 9.0
        ease = 1.0 - (1.0 - t) * (1.0 - t)
    y_off = int((1.0 - ease) * 30)
    alpha = ease

    layout = scene_meta.get("layout", "left")
    accent_c = scene_meta.get("accent_color", NEON_ORANGE)

    # -------------------------------------------------------------
    # LAYOUT 1: CENTER POWER HOOK (Scene 1 & Climax)
    # -------------------------------------------------------------
    if layout == "center":
        cw, ch = 1260, 360
        cx = (W - cw) // 2
        cy = 590 + y_off

        # Frosted glass container with subtle glow outline
        draw.rounded_rectangle([cx, cy, cx + cw, cy + ch], radius=24, fill=(12, 17, 30, int(225 * alpha)), outline=accent_c + (int(160 * alpha),), width=2)
        draw_tech_corners(draw, cx, cy, cw, ch, col=accent_c + (int(220 * alpha),), s=14)

        # Tag Header
        tag = scene_meta["tag"]
        draw.text((cx + 40, cy + 32), tag, font=F_TAG_MONO, fill=accent_c + (int(255 * alpha),))

        # Main Headline Line 1 (Giant White)
        h1 = scene_meta["headline_1"]
        draw.text((cx + 40, cy + 72), h1, font=F_HEAD_XL, fill=WHITE + (int(255 * alpha),))

        # Main Headline Line 2 (Vibrant Accent)
        h2 = scene_meta["headline_2"]
        draw.text((cx + 40, cy + 144), h2, font=F_SUB_L, fill=scene_meta.get("line2_color", NEON_MINT) + (int(255 * alpha),))

        # Metric Pills Row
        px = cx + 40
        py = cy + 240
        for p_txt, p_col in scene_meta.get("pills", []):
            bbox = draw.textbbox((0, 0), p_txt, font=F_PILL_TXT)
            pw = bbox[2] - bbox[0] + 46
            draw.rounded_rectangle([px, py, px + pw, py + 48], radius=24, fill=(20, 28, 48, int(220 * alpha)), outline=p_col + (int(180 * alpha),), width=1)
            # Dot indicator
            draw.ellipse([px + 16, py + 18, px + 26, py + 28], fill=p_col + (int(255 * alpha),))
            draw.text((px + 36, py + 11), p_txt, font=F_PILL_TXT, fill=OFF_WHITE + (int(250 * alpha),))
            px += pw + 18

    # -------------------------------------------------------------
    # LAYOUT 2: LEFT CYBER HUD CARD (e.g. PPC, AI Auto, Web Dev)
    # -------------------------------------------------------------
    elif layout == "left":
        cw, ch = 980, 360
        cx = 90
        cy = 600 + y_off

        draw.rounded_rectangle([cx, cy, cx + cw, cy + ch], radius=22, fill=(12, 17, 30, int(220 * alpha)), outline=accent_c + (int(150 * alpha),), width=1)
        draw_tech_corners(draw, cx, cy, cw, ch, col=accent_c + (int(200 * alpha),), s=12)

        # Monospace category tag with neon indicator line
        tag = scene_meta["tag"]
        draw.text((cx + 36, cy + 28), tag, font=F_TAG_MONO, fill=accent_c + (int(255 * alpha),))
        draw.line([(cx + 36, cy + 54), (cx + 36 + 180, cy + 54)], fill=accent_c + (int(160 * alpha),), width=2)

        # Headline Line 1
        h1 = scene_meta["headline_1"]
        draw.text((cx + 36, cy + 70), h1, font=F_HEAD_L, fill=WHITE + (int(255 * alpha),))

        # Headline Line 2
        h2 = scene_meta["headline_2"]
        draw.text((cx + 36, cy + 134), h2, font=F_SUB_L, fill=scene_meta.get("line2_color", NEON_ORANGE) + (int(255 * alpha),))

        # Metric Pills Row
        px = cx + 36
        py = cy + 242
        for p_txt, p_col in scene_meta.get("pills", []):
            bbox = draw.textbbox((0, 0), p_txt, font=F_PILL_TXT)
            pw = bbox[2] - bbox[0] + 44
            draw.rounded_rectangle([px, py, px + pw, py + 46], radius=23, fill=(20, 28, 48, int(210 * alpha)), outline=p_col + (int(160 * alpha),), width=1)
            draw.ellipse([px + 14, py + 17, px + 24, py + 27], fill=p_col + (int(255 * alpha),))
            draw.text((px + 34, py + 10), p_txt, font=F_PILL_TXT, fill=OFF_WHITE + (int(240 * alpha),))
            px += pw + 16

    # -------------------------------------------------------------
    # LAYOUT 3: RIGHT BENTO HUD CARD (e.g. SEO, Content, Strategy)
    # -------------------------------------------------------------
    elif layout == "right":
        cw, ch = 980, 360
        cx = W - 90 - cw
        cy = 600 + y_off

        draw.rounded_rectangle([cx, cy, cx + cw, cy + ch], radius=22, fill=(12, 17, 30, int(220 * alpha)), outline=accent_c + (int(150 * alpha),), width=1)
        draw_tech_corners(draw, cx, cy, cw, ch, col=accent_c + (int(200 * alpha),), s=12)

        tag = scene_meta["tag"]
        draw.text((cx + 36, cy + 28), tag, font=F_TAG_MONO, fill=accent_c + (int(255 * alpha),))
        draw.line([(cx + 36, cy + 54), (cx + 36 + 180, cy + 54)], fill=accent_c + (int(160 * alpha),), width=2)

        h1 = scene_meta["headline_1"]
        draw.text((cx + 36, cy + 70), h1, font=F_HEAD_L, fill=WHITE + (int(255 * alpha),))

        h2 = scene_meta["headline_2"]
        draw.text((cx + 36, cy + 134), h2, font=F_SUB_L, fill=scene_meta.get("line2_color", NEON_MINT) + (int(255 * alpha),))

        px = cx + 36
        py = cy + 242
        for p_txt, p_col in scene_meta.get("pills", []):
            bbox = draw.textbbox((0, 0), p_txt, font=F_PILL_TXT)
            pw = bbox[2] - bbox[0] + 44
            draw.rounded_rectangle([px, py, px + pw, py + 46], radius=23, fill=(20, 28, 48, int(210 * alpha)), outline=p_col + (int(160 * alpha),), width=1)
            draw.ellipse([px + 14, py + 17, px + 24, py + 27], fill=p_col + (int(255 * alpha),))
            draw.text((px + 34, py + 10), p_txt, font=F_PILL_TXT, fill=OFF_WHITE + (int(240 * alpha),))
            px += pw + 16

    # -------------------------------------------------------------
    # LAYOUT 4: WIDE BOTTOM DOCK (AI Dev, Full Strategy)
    # -------------------------------------------------------------
    elif layout == "wide":
        cw, ch = 1440, 340
        cx = (W - cw) // 2
        cy = 620 + y_off

        draw.rounded_rectangle([cx, cy, cx + cw, cy + ch], radius=22, fill=(12, 17, 30, int(225 * alpha)), outline=accent_c + (int(160 * alpha),), width=1)
        draw_tech_corners(draw, cx, cy, cw, ch, col=accent_c + (int(200 * alpha),), s=12)

        tag = scene_meta["tag"]
        draw.text((cx + 36, cy + 28), tag, font=F_TAG_MONO, fill=accent_c + (int(255 * alpha),))

        h1 = scene_meta["headline_1"]
        draw.text((cx + 36, cy + 66), h1, font=F_HEAD_L, fill=WHITE + (int(255 * alpha),))

        h2 = scene_meta["headline_2"]
        draw.text((cx + 36, cy + 128), h2, font=F_SUB_L, fill=scene_meta.get("line2_color", NEON_MINT) + (int(255 * alpha),))

        px = cx + 36
        py = cy + 225
        for p_txt, p_col in scene_meta.get("pills", []):
            bbox = draw.textbbox((0, 0), p_txt, font=F_PILL_TXT)
            pw = bbox[2] - bbox[0] + 44
            draw.rounded_rectangle([px, py, px + pw, py + 46], radius=23, fill=(20, 28, 48, int(210 * alpha)), outline=p_col + (int(160 * alpha),), width=1)
            draw.ellipse([px + 14, py + 17, px + 24, py + 27], fill=p_col + (int(255 * alpha),))
            draw.text((px + 34, py + 10), p_txt, font=F_PILL_TXT, fill=OFF_WHITE + (int(240 * alpha),))
            px += pw + 16

    im.alpha_composite(txt_layer)
    return np.array(im.convert("RGB"))


def draw_end_card(frame_idx, scene_start_frame, total_scene_frames):
    """Draws the high-octane, funky yet elite Disruptive Advertising final End Card."""
    rel = frame_idx - scene_start_frame
    ease = min(1.0, rel / 14.0)

    canvas = np.zeros((H, W, 3), dtype=np.uint8)
    canvas[:, :] = [10, 14, 24]

    # Dual glowing gradient orbs (Neon Orange on left, Neon Mint on right)
    Y, X = np.ogrid[:H, :W]
    dist_l = ((X - (W/2 - 280)) ** 2 + (Y - 320) ** 2) / float((W * 0.35) ** 2)
    dist_r = ((X - (W/2 + 280)) ** 2 + (Y - 320) ** 2) / float((W * 0.35) ** 2)
    glow_l = np.clip(1.0 - dist_l, 0.0, 1.0)
    glow_r = np.clip(1.0 - dist_r, 0.0, 1.0)

    # Orange aura left
    canvas[:, :, 0] = np.clip(canvas[:, :, 0] + glow_l * 50, 0, 255)
    canvas[:, :, 1] = np.clip(canvas[:, :, 1] + glow_l * 20, 0, 255)
    # Mint aura right
    canvas[:, :, 1] = np.clip(canvas[:, :, 1] + glow_r * 42, 0, 255)
    canvas[:, :, 2] = np.clip(canvas[:, :, 2] + glow_r * 32, 0, 255)

    im = Image.fromarray(canvas).convert("RGBA")
    draw = ImageDraw.Draw(im)

    # Animated ripple circle around logo
    pulse_r = int(95 + 15 * np.sin(rel * 0.2))
    draw.ellipse([(W/2 - pulse_r), (260 - pulse_r), (W/2 + pulse_r), (260 + pulse_r)], outline=(255, 117, 24, 70), width=2)
    draw.ellipse([(W/2 - pulse_r - 20), (260 - pulse_r - 20), (W/2 + pulse_r + 20), (260 + pulse_r + 20)], outline=(0, 245, 160, 50), width=1)

    # Centered Logo
    logo_size = int(140 + 8 * (1.0 - ease))
    logo = get_logo(logo_size)
    if logo:
        im.paste(logo, ((W - logo_size) // 2, 260 - logo_size // 2), mask=logo)

    # Wordmark
    brand_text = "INOCONNECT"
    bbox_b = draw.textbbox((0, 0), brand_text, font=F_END_LOGO)
    bw = bbox_b[2] - bbox_b[0]
    bx = (W - bw) // 2
    draw.text((bx + 2, 386), brand_text, font=F_END_LOGO, fill=(0, 0, 0, 160))
    draw.text((bx, 384), brand_text, font=F_END_LOGO, fill=(255, 255, 255, 255))

    # Subtitle / Tagline
    sub_text = "// FULL-STACK DIGITAL MARKETING & AI AUTOMATION"
    bbox_s = draw.textbbox((0, 0), sub_text, font=F_END_SUB)
    sw = bbox_s[2] - bbox_s[0]
    draw.text(((W - sw) // 2, 484), sub_text, font=F_END_SUB, fill=NEON_ORANGE + (255,))

    # Statement line
    desc_text = "Stop guessing with fragmented tactics. Partner with verified growth engineers."
    bbox_d = draw.textbbox((0, 0), desc_text, font=load_font(23, 600))
    dw = bbox_d[2] - bbox_d[0]
    draw.text(((W - dw) // 2, 540), desc_text, font=load_font(23, 600), fill=(185, 205, 230, 240))

    # High-impact Action Button
    btn_text = "CLAIM YOUR STRATEGIC GROWTH AUDIT →"
    bbox_btn = draw.textbbox((0, 0), btn_text, font=F_END_BTN)
    btn_w = bbox_btn[2] - bbox_btn[0] + 80
    btn_h = 76
    btn_x = (W - btn_w) // 2
    btn_y = 612

    draw.rounded_rectangle([btn_x, btn_y + 6, btn_x + btn_w, btn_y + btn_h + 6], radius=38, fill=(0, 0, 0, 140))
    draw.rounded_rectangle([btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], radius=38, fill=NEON_ORANGE + (255,))
    draw.text((btn_x + 40, btn_y + 19), btn_text, font=F_END_BTN, fill=(255, 255, 255, 255))

    # Website link & assurance
    url_text = "inoconnect.com   •   100% Confidential   •   Zero Strings Attached"
    bbox_u = draw.textbbox((0, 0), url_text, font=F_END_URL)
    uw = bbox_u[2] - bbox_u[0]
    draw.text(((W - uw) // 2, 730), url_text, font=F_END_URL, fill=NEON_MINT + (255,))

    return np.array(im.convert("RGB"))


# -------------------------------------------------------------
# FUNKY MASTER STORYBOARD (11 Scenes / 36.0 Seconds)
# -------------------------------------------------------------
SCENES = [
    # Scene 1: The Problem Hook
    {
        "id": "hook",
        "dur": 3.2,
        "type": "video",
        "path": stock_clip(4533),
        "layout": "center",
        "active_step": None,
        "accent_color": NEON_ORANGE,
        "tag": "// SYSTEM ALERT • MARKETING AD SPEND LEAKAGE",
        "headline_1": "STOP BURNING AD BUDGETS.",
        "headline_2": "Engineer Predictable Customer Acquisition.",
        "line2_color": NEON_ORANGE,
        "pills": [
            ("0% FLUFF", NEON_ORANGE),
            ("100% MATH", NEON_MINT),
            ("ZERO LEAKAGE", CYBER_CYAN)
        ]
    },
    # Scene 2: Service 1 — PPC & Performance Paid Ads
    {
        "id": "ppc",
        "dur": 3.2,
        "type": "video",
        "path": stock_clip(4915),
        "layout": "left",
        "active_step": 0,
        "accent_color": NEON_ORANGE,
        "tag": "// 01_PERFORMANCE_PPC // PAID_ACQUISITION",
        "headline_1": "SCALABLE PAID ACQUISITION.",
        "headline_2": "Google Ads • Meta Ads • Multi-Channel Precision.",
        "line2_color": NEON_ORANGE,
        "pills": [
            ("+340% SCALED ROAS", NEON_MINT),
            ("-42% LOWER CAC", CYBER_CYAN),
            ("HIGH INTENT", WHITE)
        ]
    },
    # Scene 3: Service 2 — SEO & AEO Dominance
    {
        "id": "seo",
        "dur": 3.2,
        "type": "image",
        "path": os.path.join(IMG_DIR, "carlos-muza-hpjSkU2UYSU-unsplash.jpg"),
        "pan_dir": "right",
        "layout": "right",
        "active_step": 1,
        "accent_color": NEON_MINT,
        "tag": "// 02_ORGANIC_DOMINANCE // SEARCH_ARCHITECTURE",
        "headline_1": "DOMINATE SEARCH & AI.",
        "headline_2": "Technical Authority • AEO Overviews • Keyword Scale.",
        "line2_color": NEON_MINT,
        "pills": [
            ("#1 POSITION LOCK", NEON_MINT),
            ("COMPOUNDING TRAFFIC", CYBER_CYAN),
            ("AEO VISIBILITY", WHITE)
        ]
    },
    # Scene 4: Service 3 — AI Automation & 24/7 DMs
    {
        "id": "ai_auto",
        "dur": 3.2,
        "type": "video",
        "path": stock_clip(41165),
        "layout": "left",
        "active_step": 2,
        "accent_color": NEON_ORANGE,
        "tag": "// 03_AUTONOMOUS_OPS // 24_7_LEAD_CAPTURE",
        "headline_1": "24/7 INSTANT LEAD ROUTING.",
        "headline_2": "Instant WhatsApp Inquiries • Automated CRM Sync.",
        "line2_color": NEON_ORANGE,
        "pills": [
            ("< 1.2s RESPONSE TIME", NEON_MINT),
            ("ZERO LEAD DROP-OFF", CYBER_CYAN),
            ("AUTONOMOUS ROUTING", WHITE)
        ]
    },
    # Scene 5: Service 4 — Custom AI Development
    {
        "id": "ai_dev",
        "dur": 3.2,
        "type": "image",
        "path": os.path.join(IMG_DIR, "blake-connally-B3l0g6HLxr8-unsplash.jpg"),
        "pan_dir": "zoom_in",
        "layout": "wide",
        "active_step": 3,
        "accent_color": CYBER_CYAN,
        "tag": "// 04_PROPRIETARY_AI_ENGINEERING // LLM_PIPELINES",
        "headline_1": "ENTERPRISE-GRADE AI PIPELINES.",
        "headline_2": "Custom LLMs • Autonomous Agents • Intelligent Ops.",
        "line2_color": NEON_MINT,
        "pills": [
            ("10X OPERATIONAL VELOCITY", NEON_MINT),
            ("PROPRIETARY MODELS", CYBER_CYAN),
            ("INTELLIGENT WORKFLOWS", WHITE)
        ]
    },
    # Scene 6: Service 5 — High-Converting Web Dev & CRO
    {
        "id": "web_dev",
        "dur": 3.2,
        "type": "image",
        "path": os.path.join(IMG_DIR, "christopher-gower-m_HRfLhgABo-unsplash.jpg"),
        "pan_dir": "left",
        "layout": "left",
        "active_step": 4,
        "accent_color": NEON_ORANGE,
        "tag": "// 05_WEB_ARCHITECTURE // CONVERSION_ENGINEERING",
        "headline_1": "LIGHTNING SPEED. MAXIMUM CRO.",
        "headline_2": "Modern Responsive Architecture Built To Convert.",
        "line2_color": NEON_ORANGE,
        "pills": [
            ("0.4s LOAD SPEED", NEON_MINT),
            ("+48% CONVERSION LIFT", CYBER_CYAN),
            ("ZERO FRICTION", WHITE)
        ]
    },
    # Scene 7: Service 6 — Content Marketing & Ad Creative
    {
        "id": "content",
        "dur": 3.2,
        "type": "video",
        "path": find_file(os.path.join(VID_DIR, "Woman_packing_leather_handbag*.mp4")),
        "layout": "right",
        "active_step": 5,
        "accent_color": NEON_MINT,
        "tag": "// 06_DIRECT_RESPONSE_CREATIVE // BRAND_ASSETS",
        "headline_1": "SCROLL-STOPPING VISUAL ASSETS.",
        "headline_2": "Direct-Response Ads • High-Impact Brand Storytelling.",
        "line2_color": NEON_MINT,
        "pills": [
            ("4.8X CLICK LIFT", NEON_MINT),
            ("COMMERCIAL PRODUCTION", CYBER_CYAN),
            ("HIGH RETENTION", WHITE)
        ]
    },
    # Scene 8: Service 7 — Social Media Scaling
    {
        "id": "social",
        "dur": 3.2,
        "type": "video",
        "path": stock_clip(51121),
        "layout": "left",
        "active_step": 6,
        "accent_color": NEON_ORANGE,
        "tag": "// 07_COMMUNITY_DISTRIBUTION // AUDIENCE_SCALE",
        "headline_1": "AMPLIFY YOUR AUDIENCE.",
        "headline_2": "Multi-Platform Reach • Community That Converts.",
        "line2_color": NEON_ORANGE,
        "pills": [
            ("VIRAL REACH", NEON_MINT),
            ("REPEAT BUYER LOYALTY", CYBER_CYAN),
            ("COMMUNITY SCALE", WHITE)
        ]
    },
    # Scene 9: Service 8 — Digital Strategy & Attribution
    {
        "id": "strategy",
        "dur": 3.2,
        "type": "video",
        "path": stock_clip(30007),
        "layout": "wide",
        "active_step": 7,
        "accent_color": NEON_MINT,
        "tag": "// 08_FULL_FUNNEL_ATTRIBUTION // DATA_SOVEREIGNTY",
        "headline_1": "ZERO-GUESSWORK COMMERCIAL ROADMAPS.",
        "headline_2": "Multi-Touch Attribution • Unified Math • Predictable Scale.",
        "line2_color": NEON_MINT,
        "pills": [
            ("100% ATTRIBUTION VISIBILITY", NEON_MINT),
            ("DATA SOVEREIGNTY", CYBER_CYAN),
            ("VERIFIED COMMERCIAL ROI", WHITE)
        ]
    },
    # Scene 10: Climax & Transformation (Rapid Cut)
    {
        "id": "climax",
        "dur": 3.2,
        "type": "video",
        "path": find_file(os.path.join(VID_DIR, "Label_printer*.mp4")),
        "layout": "center",
        "active_step": -1,  # All 8 illuminate!
        "accent_color": NEON_ORANGE,
        "tag": "// COMPLETE INOCONNECT ENGINE // ALL SYSTEMS ACTIVE",
        "headline_1": "ONE INTEGRATED MACHINE.",
        "headline_2": "UNSTOPPABLE BUSINESS REVENUE.",
        "line2_color": NEON_ORANGE,
        "pills": [
            ("8 DISCIPLINES", NEON_ORANGE),
            ("1 UNIFIED PARTNER", NEON_MINT),
            ("COMPOUNDING SCALE", CYBER_CYAN)
        ]
    },
    # Scene 11: End Card
    {
        "id": "endcard",
        "dur": 4.0,
        "type": "endcard",
    }
]

SOURCE_ENGINE = FootageSource()


def render_all_frames():
    """Renders all 1080 frames and pipes directly into FFmpeg libx264."""
    print(f"Rendering InoConnect Funky & Professional Hero Video ({TOTAL_FRAMES} frames @ {W}x{H} 30FPS)...")
    
    scene_boundaries = []
    curr_frame = 0
    for s in SCENES:
        n_frames = int(s["dur"] * FPS)
        scene_boundaries.append((curr_frame, curr_frame + n_frames, s))
        curr_frame += n_frames

    ffmpeg_cmd = [
        FFMPEG, "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{W}x{H}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        RAW_MP4
    ]
    proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE)

    storyboard_frames = []

    for s_idx, (start_f, end_f, sc) in enumerate(scene_boundaries):
        tot = end_f - start_f
        print(f"  Rendering Scene {s_idx + 1}/{len(scene_boundaries)} [{sc['id'].upper()}]: frames {start_f} to {end_f} ({sc['dur']}s)...")
        mid_point = start_f + tot // 2

        for f_idx in range(start_f, end_f):
            rel_f = f_idx - start_f
            if sc["type"] == "endcard":
                frame_rgb = draw_end_card(f_idx, start_f, tot)
            else:
                is_img = (sc["type"] == "image")
                base = SOURCE_ENGINE.get_frame(sc["path"], f_idx, start_f, tot, is_image=is_img, pan_dir=sc.get("pan_dir", "right"))
                frame_rgb = draw_funky_overlay(base, sc, rel_f, tot)

            if f_idx == mid_point:
                storyboard_frames.append((sc["id"], frame_rgb.copy()))

            proc.stdin.write(frame_rgb.tobytes())

    proc.stdin.close()
    proc.wait()
    print("Raw video pass complete:", RAW_MP4)

    save_storyboard(storyboard_frames)
    mux_final_video()


def save_storyboard(frames):
    """Combines key scene frames into a high-res contact sheet."""
    print("Generating Funky Storyboard Contact Sheet...")
    cols = 4
    rows = 3
    thumb_w, thumb_h = 480, 270
    sheet = Image.new("RGB", (cols * thumb_w, rows * thumb_h + 80), (12, 17, 30))
    draw = ImageDraw.Draw(sheet)

    draw.text((30, 25), "INOCONNECT — FUNKY & PROFESSIONAL HOMEPAGE HERO SHOWREEL", font=F_HEAD_L, fill=WHITE)
    draw.text((cols * thumb_w - 380, 32), "16:9 WIDESCREEN • DEEP URBAN HOUSE", font=F_TAG_MONO, fill=NEON_ORANGE)

    for idx, (scene_name, fr_rgb) in enumerate(frames):
        c = idx % cols
        r = idx // cols
        tx = c * thumb_w
        ty = r * thumb_h + 80
        thumb = Image.fromarray(fr_rgb).resize((thumb_w - 4, thumb_h - 4), Image.Resampling.LANCZOS)
        sheet.paste(thumb, (tx + 2, ty + 2))
        
        draw.rectangle([tx + 8, ty + 8, tx + 190, ty + 34], fill=(12, 17, 30, 220))
        draw.text((tx + 14, ty + 12), f"SCENE {idx+1}: {scene_name.upper()}", font=load_mono(13), fill=NEON_MINT)

    sheet.save(STORYBOARD_JPG, quality=92)
    print("Saved Storyboard Sheet to:", STORYBOARD_JPG)


def mux_final_video():
    """Muxes audio and video with web-optimized MP4 faststart flags."""
    print("Muxing final video with funky 48kHz stereo soundtrack...")
    cmd = [
        FFMPEG, "-y",
        "-i", RAW_MP4,
        "-i", SOUNDTRACK_WAV,
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "256k",
        "-shortest",
        "-movflags", "+faststart",
        FINAL_MP4
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print("Final Hero Video Ready:", FINAL_MP4, f"({os.path.getsize(FINAL_MP4)/(1024*1024):.2f} MB)")

    shutil.copyfile(FINAL_MP4, DOWNLOADS_COPY)
    print("Copied to User Downloads:", DOWNLOADS_COPY)


if __name__ == "__main__":
    render_all_frames()
