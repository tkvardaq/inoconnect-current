"""
InoConnect Seamless Closed-Ended Hero Loop (24.0s Broadcast Cinema Grade)
=======================================================================
- 100% Closed-Ended Seamless Loop (Last 1.5s cross-dissolves into First 1.5s)
- No company logo, no company name, no end card (pure cinematic showreel for hero)
- Shows WHY WE ARE BETTER (Positive, elite, value-first, precision engineering, 24/7 AI, ROAS)
- 100% Readable text backed by obsidian glass lower-thirds with neon accents
- 2.39:1 Anamorphic cinema letterboxing
- Mastered seamless music audio loop
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
TOTAL_SEC = 24.0
TOTAL_FRAMES = int(TOTAL_SEC * FPS)  # 720 frames

OUT_DIR = r"d:\ino website\videos"
IMG_DIR = r"d:\ino website\images"
STOCK_DIR = r"D:\videos for reels\stock\clips"
os.makedirs(OUT_DIR, exist_ok=True)

RAW_MP4 = os.path.join(OUT_DIR, "hero_loop_raw.mp4")
FINAL_MP4 = os.path.join(OUT_DIR, "inoconnect-hero-showreel.mp4")
DOWNLOADS_COPY = r"C:\Users\talha\Downloads\InoConnect_Hero_Showreel.mp4"
STORYBOARD_JPG = os.path.join(OUT_DIR, "inoconnect_hero_storyboard.jpg")
FONT_PATH = r"D:\videos for reels\fonts\Outfit-Variable.ttf"
AUDIO_LOOP = os.path.join(OUT_DIR, "seamless_hero_audio.wav")

# Brand Colors
C_PRIMARY = (65, 105, 225)      # Royal Blue #4169E1
C_ACCENT = (255, 117, 24)       # Electric Orange #FF7518
C_MINT = (68, 215, 168)         # Neon Mint #44D7A8
C_CYAN = (0, 210, 255)          # Cyber Cyan #00D2FF
C_DARK = (11, 15, 25)           # Obsidian #0B0F19
C_WHITE = (255, 255, 255)
C_MUTED = (226, 232, 240)       # Slate 200

_FONTS = {}
def get_font(size, bold=True):
    key = (size, bold)
    if key not in _FONTS:
        try:
            _FONTS[key] = ImageFont.truetype(FONT_PATH, size)
        except Exception:
            _FONTS[key] = ImageFont.load_default()
    return _FONTS[key]

class VideoClipReader:
    def __init__(self, filename):
        p = os.path.join(STOCK_DIR, filename)
        self.cap = cv2.VideoCapture(p)
        self.total = int(self.cap.get(cv2.CAP_PROP_FRAME_COUNT))
        self.fps = self.cap.get(cv2.CAP_PROP_FPS) or 24.0
        
    def get_frame(self, target_sec):
        f_num = int((target_sec * self.fps) % self.total)
        self.cap.set(cv2.CAP_PROP_POS_FRAMES, f_num)
        ret, frame = self.cap.read()
        if ret:
            h, w = frame.shape[:2]
            scale = max(W / w, H / h)
            nw, nh = int(w * scale), int(h * scale)
            resized = cv2.resize(frame, (nw, nh), interpolation=cv2.INTER_LANCZOS4)
            cx = (nw - W) // 2
            cy = (nh - H) // 2
            cropped = resized[cy:cy+H, cx:cx+W]
            return Image.fromarray(cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB))
        return Image.new("RGB", (W, H), (15, 23, 42))

def load_img(fn):
    p = os.path.join(IMG_DIR, fn)
    if os.path.exists(p):
        return Image.open(p).convert("RGB")
    return Image.new("RGB", (W, H), (15, 23, 42))

CLIP_CITY = VideoClipReader("4805-720.mp4")    # Businessman walking outside corporate towers
CLIP_BOARD = VideoClipReader("30007-720.mp4")   # Strategists at whiteboard
CLIP_EXEC = VideoClipReader("4876-720.mp4")    # Executive executing on laptop
CLIP_MOBILE = VideoClipReader("41165-720.mp4") # Mobile engagement hands
CLIP_TEAM = VideoClipReader("42125-720.mp4")   # Collaborative creative team

IMG_AUTO = load_img("inoconnect_ai_automation_hero.png")

def ease_out_cubic(x):
    return 1 - math.pow(1 - x, 3)

def ease_in_out(x):
    return 0.5 - math.cos(math.pi * x) / 2

# Apply professional cinematic color grade & letterboxing
def apply_cinematic_grade(im, contrast=1.12, warmth=1.03):
    arr = np.array(im, dtype=np.float32)
    arr[:, :, 0] = np.clip(arr[:, :, 0] * warmth, 0, 255)
    arr[:, :, 2] = np.clip(arr[:, :, 2] * (2.0 - warmth), 0, 255)
    mean = 128.0
    arr = np.clip((arr - mean) * contrast + mean, 0, 255)
    
    graded = Image.fromarray(arr.astype(np.uint8))
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    
    # 2.39:1 Anamorphic Cinema Bars (56px)
    bar_h = 56
    d.rectangle([(0, 0), (W, bar_h)], fill=(11, 15, 25, 255))
    d.rectangle([(0, H - bar_h), (W, H)], fill=(11, 15, 25, 255))
    d.line([(0, bar_h), (W, bar_h)], fill=(65, 105, 225, 120), width=1)
    d.line([(0, H - bar_h), (W, H - bar_h)], fill=(65, 105, 225, 120), width=1)
    
    graded = graded.convert("RGBA")
    graded.alpha_composite(overlay)
    return graded.convert("RGB")

# High-contrast broadcast lower-third card (100% readable over any video)
def draw_cinematic_banner(canvas, headline, subline, sub_color=C_ACCENT, y_top=760, alpha_factor=1.0):
    if alpha_factor <= 0.01:
        return
    
    draw = ImageDraw.Draw(canvas, "RGBA")
    
    f_h = get_font(50, bold=True)
    f_s = get_font(23, bold=True)
    
    b_h = draw.textbbox((0, 0), headline, font=f_h)
    w_h = b_h[2] - b_h[0]
    b_s = draw.textbbox((0, 0), subline, font=f_s)
    w_s = b_s[2] - b_s[0]
    
    content_w = max(w_h, w_s)
    pad_x = 48
    
    banner_w = min(W - 120, content_w + pad_x * 2)
    banner_h = 154
    banner_x = (W - banner_w) // 2
    banner_y = y_top
    
    bg_a = int(240 * alpha_factor)
    border_a = int(50 * alpha_factor)
    accent_a = int(255 * alpha_factor)
    text_a = int(255 * alpha_factor)
    
    # High-contrast dark obsidian glass backing
    draw.rounded_rectangle(
        [(banner_x, banner_y), (banner_x + banner_w, banner_y + banner_h)],
        radius=20,
        fill=(11, 15, 25, bg_a),
        outline=(255, 255, 255, border_a),
        width=1
    )
    
    # Left colored accent bar
    draw.rounded_rectangle(
        [(banner_x + 8, banner_y + 16), (banner_x + 14, banner_y + banner_h - 16)],
        radius=3,
        fill=sub_color + (accent_a,)
    )
    
    # Headline (crisp white with shadow)
    tx_h = (W - w_h) // 2
    draw.text((tx_h + 1, banner_y + 28 + 1), headline, font=f_h, fill=(0, 0, 0, int(200 * alpha_factor)))
    draw.text((tx_h, banner_y + 28), headline, font=f_h, fill=(255, 255, 255, text_a))
    
    # Subline
    tx_s = (W - w_s) // 2
    draw.text((tx_s + 1, banner_y + 94 + 1), subline, font=f_s, fill=(0, 0, 0, int(200 * alpha_factor)))
    draw.text((tx_s, banner_y + 94), subline, font=f_s, fill=sub_color + (text_a,))

# Top Cinema Brand Bar (No company name, pure capability tracking)
CHAPTERS = [
    ("01 // REVENUE ARCHITECTURE", 0.0, 6.0),
    ("02 // CONVERSION MASTERY", 6.0, 12.0),
    ("03 // AUTONOMOUS AI PIPELINE", 12.0, 18.0),
    ("04 // MATHEMATICAL SCALE", 18.0, 24.0)
]

def draw_cinema_brand_bar(draw, t):
    bar_y = 18
    # Left indicator
    draw.text((70, bar_y), "GROWTH SHOWREEL", font=get_font(15, bold=True), fill=C_WHITE)
    draw.text((230, bar_y), "•", font=get_font(15, bold=True), fill=C_ACCENT)
    draw.text((245, bar_y), "PREDICTABLE PIPELINE ENGINE", font=get_font(13, bold=False), fill=C_MUTED)
    
    # Right live chapter indicator
    for name, st, et in CHAPTERS:
        if st <= t < et:
            draw.ellipse([(W - 350, bar_y + 4), (W - 340, bar_y + 14)], fill=C_MINT)
            draw.text((W - 328, bar_y), name, font=get_font(13, bold=True), fill=C_MINT)
            break

def calculate_fade(t_local, duration, fade_in=0.6, fade_out=0.6):
    if t_local < fade_in:
        return ease_out_cubic(t_local / fade_in)
    elif t_local > (duration - fade_out):
        return ease_out_cubic((duration - t_local) / fade_out)
    return 1.0

def generate_frame(f_idx):
    t = f_idx / FPS
    
    # -------------------------------------------------------------------------
    # ACT 1 (0.0s – 6.0s): REVENUE ARCHITECTURE (Executive & Corporate Motion)
    # -------------------------------------------------------------------------
    if t < 6.0:
        base = CLIP_CITY.get_frame(t)
        stage = apply_cinematic_grade(base, contrast=1.16, warmth=1.03)
        draw = ImageDraw.Draw(stage, "RGBA")
        draw_cinema_brand_bar(draw, t)
        
        fade = calculate_fade(t, 6.0, fade_in=0.5, fade_out=0.5)
        draw_cinematic_banner(
            stage,
            "ENGINEERED REVENUE PIPELINES.",
            "FULL-FUNNEL ARCHITECTURE • PRECISION TARGETING • RELENTLESS SCALE",
            sub_color=C_CYAN,
            y_top=765,
            alpha_factor=fade
        )
        return stage
        
    # -------------------------------------------------------------------------
    # ACT 2 (6.0s – 12.0s): CONVERSION MASTERY (Creative Team + Laptop Execution)
    # -------------------------------------------------------------------------
    elif t < 12.0:
        t_rel = t - 6.0
        if t_rel < 3.0:
            base = CLIP_BOARD.get_frame(t_rel + 1.0)
        else:
            p_split = (t_rel - 3.0) / 0.8
            f1 = CLIP_BOARD.get_frame(t_rel + 1.0)
            f2 = CLIP_EXEC.get_frame(t_rel - 3.0)
            if p_split < 1.0:
                base = Image.blend(f1, f2, ease_in_out(p_split))
            else:
                base = f2
                
        stage = apply_cinematic_grade(base, contrast=1.15, warmth=1.04)
        draw = ImageDraw.Draw(stage, "RGBA")
        draw_cinema_brand_bar(draw, t)
        
        fade = calculate_fade(t_rel, 6.0, fade_in=0.5, fade_out=0.5)
        draw_cinematic_banner(
            stage,
            "CINEMATIC CREATIVE MEETS CONVERSION DATA.",
            "HIGH-IMPACT ASSETS CRAFTED FOR HIGH-VALUE BUYERS",
            sub_color=C_ACCENT,
            y_top=765,
            alpha_factor=fade
        )
        return stage
        
    # -------------------------------------------------------------------------
    # ACT 3 (12.0s – 18.0s): 24/7 AUTONOMOUS AI PIPELINE (3D Platform + Mobile)
    # -------------------------------------------------------------------------
    elif t < 18.0:
        t_rel = t - 12.0
        p = t_rel / 6.0
        scale = 1.0 + 0.05 * ease_in_out(p)
        iw, ih = IMG_AUTO.size
        cw, ch = int(iw / scale), int(ih / scale)
        cropped = IMG_AUTO.crop(((iw - cw)//2, (ih - ch)//2, (iw + cw)//2, (ih + ch)//2))
        base = cropped.resize((W, H), Image.Resampling.LANCZOS)
        
        # Real-time mobile buyer interaction PIP
        mob_frame = CLIP_MOBILE.get_frame(t_rel)
        mob_w, mob_h = 440, 248
        mob_res = mob_frame.resize((mob_w, mob_h), Image.Resampling.LANCZOS)
        base.paste(mob_res, (W - mob_w - 80, 140))
        
        d_temp = ImageDraw.Draw(base)
        d_temp.rectangle([(W - mob_w - 82, 138), (W - 78, 140 + mob_h + 2)], outline=C_CYAN, width=2)
        d_temp.text((W - mob_w - 70, 150), "● 24/7 REAL-TIME BUYER ROUTING", font=get_font(14, bold=True), fill=C_CYAN)
        
        stage = apply_cinematic_grade(base, contrast=1.16, warmth=1.0)
        draw = ImageDraw.Draw(stage, "RGBA")
        draw_cinema_brand_bar(draw, t)
        
        fade = calculate_fade(t_rel, 6.0, fade_in=0.5, fade_out=0.5)
        draw_cinematic_banner(
            stage,
            "24/7 AUTONOMOUS AI LEAD ENGINES.",
            "< 0.8s INSTANT QUALIFICATION • REAL-TIME ZERO-LATENCY ROUTING",
            sub_color=C_CYAN,
            y_top=765,
            alpha_factor=fade
        )
        return stage

    # -------------------------------------------------------------------------
    # ACT 4 (18.0s – 24.0s): MATHEMATICALLY PREDICTABLE SCALE & SEAMLESS LOOP
    # -------------------------------------------------------------------------
    else:
        t_rel = t - 18.0
        
        # Team collaboration momentum
        f_team = CLIP_TEAM.get_frame(t_rel)
        
        # SEAMLESS LOOP CROSS-DISSOLVE (Last 1.5 seconds -> Act 1 opening frames)
        if t >= 22.5:
            loop_p = (t - 22.5) / 1.5  # 0.0 -> 1.0
            # Target is the exact opening of Act 1 (t = 0.0 to 1.5s)
            f_loop_target = CLIP_CITY.get_frame(t - 22.5)
            base = Image.blend(f_team, f_loop_target, ease_in_out(loop_p))
        else:
            base = f_team
            
        stage = apply_cinematic_grade(base, contrast=1.18, warmth=1.04)
        draw = ImageDraw.Draw(stage, "RGBA")
        draw_cinema_brand_bar(draw, t)
        
        # Banner fades out gracefully before the loop seam so there is no text pop
        fade = calculate_fade(t_rel, 6.0, fade_in=0.5, fade_out=1.6)
        draw_cinematic_banner(
            stage,
            "MATHEMATICALLY PREDICTABLE SCALE.",
            "4.8x AVERAGE ROAS • 98% RETENTION • COMPOUNDING ENTERPRISE VALUE",
            sub_color=C_MINT,
            y_top=765,
            alpha_factor=fade
        )
        return stage

def main():
    print(f"=== Rendering Seamless Closed-Ended Hero Loop ===")
    print(f"Total: {TOTAL_FRAMES} frames @ 1920x1080 30FPS ({TOTAL_SEC}s)")
    print(f"Seamless Cross-Dissolve Seam: 22.5s – 24.0s into 0.0s – 1.5s")
    
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
        0,     # Act 1 start
        135,   # Act 1 peak
        225,   # Act 2 (Board/Team)
        315,   # Act 2 (Exec)
        450,   # Act 3 (AI Pipeline)
        600,   # Act 4 (Scale)
        705    # Seamless Loop Seam
    ]
    saved_thumbs = []
    
    for f in range(TOTAL_FRAMES):
        frame = generate_frame(f)
        proc.stdin.write(frame.tobytes())
        
        if f in storyboard_frames:
            saved_thumbs.append(frame.copy())
            
        if f % 90 == 0:
            pct = (f / TOTAL_FRAMES) * 100
            print(f"  Frame {f}/{TOTAL_FRAMES} ({pct:.1f}%) rendered...")
            
    proc.stdin.close()
    proc.wait()
    print("Video stream finished. Muxing with seamless audio loop...")
    
    # Mux with seamless audio
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
    print(f"Master seamless loop created: {FINAL_MP4}")
    
    # Copy to downloads
    shutil.copy2(FINAL_MP4, DOWNLOADS_COPY)
    print(f"Copied to downloads: {DOWNLOADS_COPY}")
    
    # Build 16:9 Storyboard
    print("Generating updated storyboard contact sheet...")
    sw, sh = 1920, 1080
    sheet = Image.new("RGB", (sw, sh), (11, 15, 25))
    s_draw = ImageDraw.Draw(sheet)
    
    s_draw.text((70, 45), "INOCONNECT // SEAMLESS HERO SHOWREEL LOOP", font=get_font(28, bold=True), fill=C_WHITE)
    s_draw.text((sw - 480, 48), "SEAMLESS CLOSED LOOP • 24.0s @ 1080P", font=get_font(16, bold=True), fill=C_CYAN)
    
    cols, rows = 3, 2
    tw, th = 560, 315
    start_x = 70
    start_y = 110
    gap_x = 45
    gap_y = 70
    
    labels = [
        "1. ARCHITECTURAL PRECISION (EXECUTIVE MOTION)",
        "2. CONVERSION MASTERY (CREATIVE TEAM)",
        "3. HIGH-INTENT CONVERSION (DATA EXECUTION)",
        "4. 24/7 AUTONOMOUS AI PIPELINE (3D HUD + MOBILE)",
        "5. MATHEMATICALLY PREDICTABLE SCALE (RESULTS)",
        "6. SEAMLESS LOOP CROSS-DISSOLVE (BACK TO 0:00)"
    ]
    
    for i in range(min(6, len(saved_thumbs))):
        c = i % cols
        r = i // cols
        x = start_x + c * (tw + gap_x)
        y = start_y + r * (th + gap_y)
        
        t_img = saved_thumbs[i].resize((tw, th), Image.Resampling.LANCZOS)
        sheet.paste(t_img, (x, y))
        
        # Border
        s_draw.rectangle([(x - 1, y - 1), (x + tw, y + th)], outline=(65, 105, 225, 100), width=1)
        # Label
        s_draw.text((x, y - 26), labels[i], font=get_font(13, bold=False), fill=(226, 232, 240))
        
    sheet.save(STORYBOARD_JPG, quality=95)
    print(f"Updated storyboard saved: {STORYBOARD_JPG}")

if __name__ == "__main__":
    main()
