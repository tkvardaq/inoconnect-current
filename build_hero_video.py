"""
InoConnect — Disruptive Advertising-Style Homepage Hero Video Generator (v2)
Aspect Ratio: 16:9 Widescreen (1920x1080)
Duration: 36.0 seconds (1080 frames @ 30 FPS)
Features:
- Real commercial cinema footage & high-resolution authenticated assets
- Unified cinema S-curve color grading & dark scrim vignettes
- Disruptive Advertising-style frosted glass category badges & dual-line bold typography
- Clean vector checkmark icons (zero missing glyphs)
- Dedicated presentation of all 8 core services:
  01. PPC & Performance Paid Ads
  02. Search Engine Optimization (SEO & AEO)
  03. AI Automation & Smart Routing
  04. Custom AI Development & Intelligent Ops
  05. High-Converting Web Development & CRO
  06. Content Marketing & Direct-Response Creative
  07. Social Media Growth & Audience Building
  08. Digital Strategy & Full-Funnel Analytics
- High-energy mastered soundtrack (36s Driving Ambition)
- High-impact Disruptive-style branded End Card with InoConnect Logo & CTA
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
SOUNDTRACK_WAV = r"D:\videos for reels\stock\hero_soundtrack_36s.wav"

OUT_DIR = r"d:\ino website\videos"
os.makedirs(OUT_DIR, exist_ok=True)
RAW_MP4 = os.path.join(OUT_DIR, "hero_raw.mp4")
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


# Typography Hierarchy
F_WATERMARK = load_font(21, 700)
F_BADGE     = load_font(24, 800)
F_HEAD_1    = load_font(54, 900)
F_HEAD_2    = load_font(42, 700)
F_PILL      = load_font(24, 600)
F_END_LOGO  = load_font(72, 900)
F_END_SUB   = load_font(28, 700)
F_END_BTN   = load_font(32, 800)
F_END_URL   = load_font(25, 600)

WHITE     = (255, 255, 255)
OFF_WHITE = (230, 236, 245)
ORANGE    = (255, 117, 24)    # InoConnect Orange #FF7518
MINT      = (68, 215, 168)    # InoConnect Mint #44D7A8
BLUE      = (65, 105, 225)    # Royal Blue #4169E1
CHARCOAL  = (15, 23, 42)      # Obsidian Navy #0F172A


class FootageSource:
    """Manages loading, scaling, and Ken-Burns animation for both video and still clips."""
    def __init__(self):
        self.video_caps = {}
        self.images = {}
        # Cinema color grade LUT
        x = np.arange(256, dtype=np.float32) / 255.0
        s_curve = 0.5 + 0.5 * np.tanh(2.1 * (x - 0.5))
        s_curve = (s_curve - s_curve.min()) / (s_curve.max() - s_curve.min())
        self.lut = np.clip(x * 0.6 + s_curve * 0.4, 0.0, 1.0)
        self.lut_u8 = (self.lut * 255.0).astype(np.uint8)

        # Precompute gradient scrim overlay (RGBA)
        scrim = np.zeros((H, W, 4), dtype=np.uint8)
        # Top gradient: 0 to 220px (dark to transparent)
        for y in range(220):
            alpha = int(140 * (1.0 - y / 220.0))
            scrim[y, :, :] = [10, 15, 28, alpha]
        # Bottom gradient: 680px to 1080px (transparent to deep obsidian)
        for y in range(680, H):
            prog = (y - 680) / float(H - 680)
            alpha = int(220 * (prog ** 1.3))
            scrim[y, :, :] = [8, 12, 24, alpha]
        self.scrim_img = Image.fromarray(scrim, mode="RGBA")

    def grade(self, rgb_np):
        graded = cv2.LUT(rgb_np, self.lut_u8)
        f = graded.astype(np.float32)
        f[:, :, 0] = np.clip(f[:, :, 0] * 1.02, 0, 255)
        f[:, :, 2] = np.clip(f[:, :, 2] * 0.98 + 1.5, 0, 255)
        return f.astype(np.uint8)

    def get_frame(self, path, frame_idx, scene_start_frame, scene_total_frames, is_image=False, pan_dir="right"):
        if is_image:
            if path not in self.images:
                im = Image.open(path).convert("RGB")
                self.images[path] = im
            im = self.images[path]
            iw, ih = im.size
            progress = (frame_idx - scene_start_frame) / max(1, scene_total_frames)
            scale = 1.05 + 0.12 * progress
            tgt_ar = W / H
            crop_w = int(min(iw, ih * tgt_ar) / scale)
            crop_h = int(min(ih, iw / tgt_ar) / scale)

            if pan_dir == "right":
                cx = int((iw - crop_w) * (0.2 + 0.6 * progress))
                cy = int((ih - crop_h) * 0.5)
            elif pan_dir == "zoom_in":
                cx = int((iw - crop_w) * 0.5)
                cy = int((ih - crop_h) * (0.4 + 0.2 * progress))
            else:
                cx = int((iw - crop_w) * (0.8 - 0.6 * progress))
                cy = int((ih - crop_h) * 0.5)

            cx = max(0, min(cx, iw - crop_w))
            cy = max(0, min(cy, ih - crop_h))

            cropped = im.crop((cx, cy, cx + crop_w, cy + crop_h)).resize((W, H), Image.Resampling.LANCZOS)
            return self.grade(np.array(cropped))

        # Video source
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
                return np.full((H, W, 3), 15, dtype=np.uint8)

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


def draw_disruptive_overlay(base_rgb, scene_meta, frame_in_scene, total_scene_frames):
    """Draws sleek Disruptive Advertising typography, glass badges, and clean vector icons."""
    im = Image.fromarray(base_rgb).convert("RGBA")
    
    im.alpha_composite(SOURCE_ENGINE.scrim_img)
    
    txt_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(txt_layer)

    # Top Brand Header
    logo = get_logo(42)
    if logo:
        txt_layer.paste(logo, (90, 50), mask=logo)
    
    draw.text((144, 56), "INOCONNECT", font=F_WATERMARK, fill=(255, 255, 255, 245))
    draw.text((298, 56), "•", font=F_WATERMARK, fill=ORANGE + (245,))
    draw.text((318, 56), "DIGITAL GROWTH & AI SYSTEMS", font=F_WATERMARK, fill=(160, 180, 210, 210))
    
    # Right-side live badge
    live_badge_text = "VERIFIED PERFORMANCE"
    bbox_live = draw.textbbox((0, 0), live_badge_text, font=load_font(16, 700))
    bw = bbox_live[2] - bbox_live[0] + 44
    bx = W - 90 - bw
    by = 50
    draw.rounded_rectangle([bx, by, bx + bw, by + 36], radius=18, fill=(15, 23, 42, 200), outline=(255, 255, 255, 50), width=1)
    draw.ellipse([bx + 14, by + 13, bx + 23, by + 22], fill=MINT + (255,))
    draw.text((bx + 32, by + 8), live_badge_text, font=load_font(16, 700), fill=(240, 248, 255, 240))

    # Kinetic entry animation
    ease = 1.0
    if frame_in_scene < 10:
        t = frame_in_scene / 10.0
        ease = 1.0 - (1.0 - t) * (1.0 - t)
    y_offset = int((1.0 - ease) * 25)
    alpha_mul = ease

    # 1. Category / Service Glass Badge
    badge_text = scene_meta["badge"]
    badge_accent = scene_meta.get("accent_color", ORANGE)
    bbox_b = draw.textbbox((0, 0), badge_text, font=F_BADGE)
    badge_w = bbox_b[2] - bbox_b[0] + 36
    badge_x = 90
    badge_y = 730 + y_offset

    draw.rounded_rectangle([badge_x, badge_y, badge_x + badge_w, badge_y + 44], radius=10, fill=(15, 23, 42, int(225 * alpha_mul)), outline=badge_accent + (int(180 * alpha_mul),), width=1)
    draw.text((badge_x + 18, badge_y + 8), badge_text, font=F_BADGE, fill=badge_accent + (int(255 * alpha_mul),))

    # 2. Main Headline Line 1 (Crisp White)
    head_1 = scene_meta["headline_1"]
    h1_y = 786 + y_offset
    draw.text((badge_x + 2, h1_y + 2), head_1, font=F_HEAD_1, fill=(0, 0, 0, int(200 * alpha_mul)))
    draw.text((badge_x, h1_y), head_1, font=F_HEAD_1, fill=WHITE + (int(255 * alpha_mul),))

    # 3. Main Headline Line 2 (Vibrant Accent)
    head_2 = scene_meta["headline_2"]
    h2_y = 852 + y_offset
    h2_col = scene_meta.get("line2_color", badge_accent)
    draw.text((badge_x + 2, h2_y + 2), head_2, font=F_HEAD_2, fill=(0, 0, 0, int(180 * alpha_mul)))
    draw.text((badge_x, h2_y), head_2, font=F_HEAD_2, fill=h2_col + (int(255 * alpha_mul),))

    # 4. Bottom Metric / Deliverable Pill (With vector checkmark icon)
    metric_text = scene_meta["metric"]
    bbox_m = draw.textbbox((0, 0), metric_text, font=F_PILL)
    mw = bbox_m[2] - bbox_m[0] + 58
    mx = badge_x
    my = 918 + y_offset
    draw.rounded_rectangle([mx, my, mx + mw, my + 40], radius=20, fill=(15, 23, 42, int(210 * alpha_mul)), outline=(255, 255, 255, int(45 * alpha_mul)), width=1)
    
    # Vector Checkmark badge
    ic_cx = mx + 22
    ic_cy = my + 20
    draw.ellipse([ic_cx - 9, ic_cy - 9, ic_cx + 9, ic_cy + 9], fill=MINT + (int(255 * alpha_mul),))
    draw.line([(ic_cx - 4, ic_cy), (ic_cx - 1, ic_cy + 3), (ic_cx + 4, ic_cy - 3)], fill=(15, 23, 42, int(255 * alpha_mul)), width=2)
    
    draw.text((mx + 42, my + 7), metric_text, font=F_PILL, fill=OFF_WHITE + (int(240 * alpha_mul),))

    # Merge overlay with base
    im.alpha_composite(txt_layer)
    return np.array(im.convert("RGB"))


def draw_end_card(frame_idx, scene_start_frame, total_scene_frames):
    """Draws the Disruptive Advertising-style high-converting final End Card."""
    rel = frame_idx - scene_start_frame
    ease = min(1.0, rel / 14.0)

    canvas = np.zeros((H, W, 3), dtype=np.uint8)
    canvas[:, :] = [10, 15, 28]

    # Warm radial gradient glow at center
    Y, X = np.ogrid[:H, :W]
    dist_sq = ((X - W/2) ** 2 + (Y - H/2 + 20) ** 2) / float((W * 0.45) ** 2)
    glow = np.clip(1.0 - dist_sq, 0.0, 1.0)
    canvas[:, :, 0] = np.clip(canvas[:, :, 0] + glow * 48, 0, 255)
    canvas[:, :, 1] = np.clip(canvas[:, :, 1] + glow * 26, 0, 255)
    canvas[:, :, 2] = np.clip(canvas[:, :, 2] + glow * 16, 0, 255)

    im = Image.fromarray(canvas).convert("RGBA")
    draw = ImageDraw.Draw(im)

    # Centered Logo
    logo_size = int(145 + 10 * (1.0 - ease))
    logo = get_logo(logo_size)
    if logo:
        lx = (W - logo_size) // 2
        ly = 230
        im.paste(logo, (lx, ly), mask=logo)

    # Brand Wordmark: INOCONNECT
    brand_text = "INOCONNECT"
    bbox_b = draw.textbbox((0, 0), brand_text, font=F_END_LOGO)
    bw = bbox_b[2] - bbox_b[0]
    bx = (W - bw) // 2
    draw.text((bx, 400), brand_text, font=F_END_LOGO, fill=(255, 255, 255, 255))

    # Subtitle: FULL-STACK DIGITAL MARKETING & AI AUTOMATION
    sub_text = "FULL-STACK DIGITAL MARKETING & AI AUTOMATION"
    bbox_s = draw.textbbox((0, 0), sub_text, font=F_END_SUB)
    sw = bbox_s[2] - bbox_s[0]
    sx = (W - sw) // 2
    draw.text((sx, 492), sub_text, font=F_END_SUB, fill=ORANGE + (255,))

    # Description line
    desc_text = "Stop wasting budget. Engineer predictable revenue with zero fluff."
    bbox_d = draw.textbbox((0, 0), desc_text, font=F_PILL)
    dw = bbox_d[2] - bbox_d[0]
    dx = (W - dw) // 2
    draw.text((dx, 545), desc_text, font=F_PILL, fill=(185, 200, 220, 240))

    # CTA Button
    btn_text = "GET YOUR STRATEGIC GROWTH AUDIT"
    bbox_btn = draw.textbbox((0, 0), btn_text, font=F_END_BTN)
    btn_w = bbox_btn[2] - bbox_btn[0] + 72
    btn_h = 74
    btn_x = (W - btn_w) // 2
    btn_y = 615

    draw.rounded_rectangle([btn_x, btn_y + 4, btn_x + btn_w, btn_y + btn_h + 4], radius=37, fill=(0, 0, 0, 130))
    draw.rounded_rectangle([btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], radius=37, fill=ORANGE + (255,))
    draw.text((btn_x + 36, btn_y + 17), btn_text, font=F_END_BTN, fill=(255, 255, 255, 255))

    # Website link & assurance
    url_text = "inoconnect.com  •  100% Confidential  •  Zero Strings Attached"
    bbox_u = draw.textbbox((0, 0), url_text, font=F_END_URL)
    uw = bbox_u[2] - bbox_u[0]
    ux = (W - uw) // 2
    draw.text((ux, 725), url_text, font=F_END_URL, fill=MINT + (240,))

    return np.array(im.convert("RGB"))


SCENES = [
    {
        "id": "hook",
        "dur": 3.2,
        "type": "video",
        "path": stock_clip(4533),
        "badge": "INOCONNECT PERFORMANCE ENGINE",
        "accent_color": ORANGE,
        "headline_1": "STOP GUESSING WITH AD BUDGETS.",
        "headline_2": "Engineer Predictable Customer Acquisition.",
        "line2_color": ORANGE,
        "metric": "0% Fluff • 100% Math • Full Accountability",
    },
    {
        "id": "ppc",
        "dur": 3.2,
        "type": "video",
        "path": stock_clip(4915),
        "badge": "01 / PPC & PAID ADVERTISING",
        "accent_color": ORANGE,
        "headline_1": "HIGH-ROAS PERFORMANCE ADS.",
        "headline_2": "Google Ads • Meta Ads • Multi-Channel Precision",
        "line2_color": ORANGE,
        "metric": "Scalable CAC • High Intent • Maximum Pipeline Growth",
    },
    {
        "id": "seo",
        "dur": 3.2,
        "type": "image",
        "path": os.path.join(IMG_DIR, "carlos-muza-hpjSkU2UYSU-unsplash.jpg"),
        "pan_dir": "right",
        "badge": "02 / SEARCH ENGINE OPTIMIZATION",
        "accent_color": MINT,
        "headline_1": "DOMINATE SEARCH & AI DISCOVERY.",
        "headline_2": "Technical SEO • Keyword Authority • AI Overviews (AEO)",
        "line2_color": MINT,
        "metric": "Compounding High-Intent Organic Traffic",
    },
    {
        "id": "ai_auto",
        "dur": 3.2,
        "type": "video",
        "path": stock_clip(41165),
        "badge": "03 / AI AUTOMATION & AGENTS",
        "accent_color": ORANGE,
        "headline_1": "24/7 AUTONOMOUS REPLIES & ROUTING.",
        "headline_2": "Instant WhatsApp Inquiries • Automated CRM Sync",
        "line2_color": ORANGE,
        "metric": "Zero Lead Drop-Off • Capture Inquiries In Seconds",
    },
    {
        "id": "ai_dev",
        "dur": 3.2,
        "type": "image",
        "path": os.path.join(IMG_DIR, "blake-connally-B3l0g6HLxr8-unsplash.jpg"),
        "pan_dir": "zoom_in",
        "badge": "04 / CUSTOM AI DEVELOPMENT",
        "accent_color": MINT,
        "headline_1": "ENTERPRISE-GRADE AI PIPELINES.",
        "headline_2": "Custom LLMs • Autonomous Agents • Intelligent Ops",
        "line2_color": MINT,
        "metric": "Future-Proof Your Business Infrastructure",
    },
    {
        "id": "web_dev",
        "dur": 3.2,
        "type": "image",
        "path": os.path.join(IMG_DIR, "christopher-gower-m_HRfLhgABo-unsplash.jpg"),
        "pan_dir": "left",
        "badge": "05 / HIGH-PERFORMANCE WEB DEV",
        "accent_color": ORANGE,
        "headline_1": "LIGHTNING SPEED. MAXIMUM CRO.",
        "headline_2": "Modern Responsive Architecture Built To Convert",
        "line2_color": ORANGE,
        "metric": "Sub-Second Load Times • Frictionless Funnels",
    },
    {
        "id": "content",
        "dur": 3.2,
        "type": "video",
        "path": find_file(os.path.join(VID_DIR, "Woman_packing_leather_handbag*.mp4")),
        "badge": "06 / CONTENT & DIRECT CREATIVE",
        "accent_color": MINT,
        "headline_1": "SCROLL-STOPPING VISUAL ASSETS.",
        "headline_2": "Direct-Response Ads • High-Impact Brand Storytelling",
        "line2_color": MINT,
        "metric": "Creative Assets Engineered For Commercial Action",
    },
    {
        "id": "social",
        "dur": 3.2,
        "type": "video",
        "path": stock_clip(51121),
        "badge": "07 / SOCIAL MEDIA SCALING",
        "accent_color": ORANGE,
        "headline_1": "AMPLIFY YOUR BRAND COMMUNITY.",
        "headline_2": "Multi-Platform Distribution • Organic Audience Expansion",
        "line2_color": ORANGE,
        "metric": "Turn Casual Scrollers Into Loyal Long-Term Buyers",
    },
    {
        "id": "strategy",
        "dur": 3.2,
        "type": "video",
        "path": stock_clip(30007),
        "badge": "08 / DIGITAL STRATEGY & ANALYTICS",
        "accent_color": MINT,
        "headline_1": "FULL-FUNNEL ATTRIBUTION & CRO.",
        "headline_2": "Zero-Guesswork Math • Unified Revenue Roadmaps",
        "line2_color": MINT,
        "metric": "Clear Commercial Return On Every Single Marketing Dollar",
    },
    {
        "id": "climax",
        "dur": 3.2,
        "type": "video",
        "path": find_file(os.path.join(VID_DIR, "Label_printer*.mp4")),
        "badge": "THE INOCONNECT ENGINE",
        "accent_color": ORANGE,
        "headline_1": "ONE INTEGRATED SYSTEM.",
        "headline_2": "UNSTOPPABLE BUSINESS REVENUE.",
        "line2_color": ORANGE,
        "metric": "From First Click To Compounding Customer Retention",
    },
    {
        "id": "endcard",
        "dur": 4.0,
        "type": "endcard",
        "badge": "INOCONNECT",
    }
]

SOURCE_ENGINE = FootageSource()


def render_all_frames():
    """Renders all 1080 frames and pipes directly into FFmpeg libx264."""
    print(f"Rendering InoConnect Disruptive-style Hero Video v2 ({TOTAL_FRAMES} frames @ {W}x{H} 30FPS)...")
    
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
                frame_rgb = draw_disruptive_overlay(base, sc, rel_f, tot)

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
    print("Generating Storyboard Contact Sheet...")
    cols = 4
    rows = 3
    thumb_w, thumb_h = 480, 270
    sheet = Image.new("RGB", (cols * thumb_w, rows * thumb_h + 80), (15, 23, 42))
    draw = ImageDraw.Draw(sheet)

    draw.text((30, 25), "INOCONNECT — HOMEPAGE HERO SHOWREEL (DISRUPTIVE ADVERTISING STYLE)", font=F_BADGE, fill=WHITE)
    draw.text((cols * thumb_w - 380, 28), "16:9 WIDESCREEN • 36.0 SECONDS", font=load_font(20, 700), fill=ORANGE)

    for idx, (scene_name, fr_rgb) in enumerate(frames):
        c = idx % cols
        r = idx // cols
        tx = c * thumb_w
        ty = r * thumb_h + 80
        thumb = Image.fromarray(fr_rgb).resize((thumb_w - 4, thumb_h - 4), Image.Resampling.LANCZOS)
        sheet.paste(thumb, (tx + 2, ty + 2))
        
        draw.rectangle([tx + 8, ty + 8, tx + 180, ty + 34], fill=(15, 23, 42, 220))
        draw.text((tx + 14, ty + 12), f"SCENE {idx+1}: {scene_name.upper()}", font=load_font(15, 800), fill=MINT)

    sheet.save(STORYBOARD_JPG, quality=92)
    print("Saved Storyboard Sheet to:", STORYBOARD_JPG)


def mux_final_video():
    """Muxes audio and video with web-optimized MP4 faststart flags."""
    print("Muxing final video with mastered 48kHz stereo soundtrack...")
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
