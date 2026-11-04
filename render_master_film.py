"""
InoConnect Master Brand Film Engine (Broadcast Cinematic Grade - V2 Ultra Contrast)
===================================================================================
- High-contrast broadcast lower-third banners (100% readable over any footage)
- Real commercial video clips + 4K agency photography + 3D holographic assets
- 2.39:1 Anamorphic cinema framing with chapter tracker
- Gemini 2.5 studio voiceover + mastered score
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
TOTAL_SEC = 34.5
TOTAL_FRAMES = int(TOTAL_SEC * FPS)  # 1035 frames

OUT_DIR = r"d:\ino website\videos"
IMG_DIR = r"d:\ino website\images"
STOCK_DIR = r"D:\videos for reels\stock\clips"
os.makedirs(OUT_DIR, exist_ok=True)

RAW_MP4 = os.path.join(OUT_DIR, "master_raw.mp4")
FINAL_MP4 = os.path.join(OUT_DIR, "inoconnect-hero-showreel.mp4")
DOWNLOADS_COPY = r"C:\Users\talha\Downloads\InoConnect_Hero_Showreel.mp4"
STORYBOARD_JPG = os.path.join(OUT_DIR, "inoconnect_hero_storyboard.jpg")
LOGO_PATH = r"d:\ino website\logo.png"
FONT_PATH = r"D:\videos for reels\fonts\Outfit-Variable.ttf"
MASTERED_AUDIO = os.path.join(OUT_DIR, "inoconnect_story_audio_mastered.wav")

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

CLIP_BOARD = VideoClipReader("30007-720.mp4")   # Strategists at whiteboard
CLIP_EXEC = VideoClipReader("4876-720.mp4")    # Female executive on laptop
CLIP_CITY = VideoClipReader("4805-720.mp4")    # Businessman walking outside corporate towers
CLIP_MOBILE = VideoClipReader("41165-720.mp4") # Mobile engagement hands

IMG_OFFICE = load_img("austin-distel-gUIJ0YszPig-unsplash.jpg")
IMG_AUTO = load_img("inoconnect_ai_automation_hero.png")
IMG_STRATEGY = load_img("inoconnect_strategy_workspace.png")
IMG_GROWTH = load_img("inoconnect_growth_matrix.png")

LOGO_IMG = None
if os.path.exists(LOGO_PATH):
    try:
        LOGO_IMG = Image.open(LOGO_PATH).convert("RGBA")
    except Exception as e:
        print("Logo error:", e)

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
    d.line([(0, bar_h), (W, bar_h)], fill=(65, 105, 225, 140), width=1)
    d.line([(0, H - bar_h), (W, H - bar_h)], fill=(65, 105, 225, 140), width=1)
    
    graded = graded.convert("RGBA")
    graded.alpha_composite(overlay)
    return graded.convert("RGB")

# High-contrast broadcast lower-third card (100% readable over any video)
def draw_cinematic_banner(canvas, headline, subline, sub_color=C_ACCENT, y_top=760):
    draw = ImageDraw.Draw(canvas, "RGBA")
    
    f_h = get_font(52, bold=True)
    f_s = get_font(24, bold=True)
    
    b_h = draw.textbbox((0, 0), headline, font=f_h)
    w_h = b_h[2] - b_h[0]
    b_s = draw.textbbox((0, 0), subline, font=f_s)
    w_s = b_s[2] - b_s[0]
    
    content_w = max(w_h, w_s)
    pad_x = 50
    pad_y = 24
    
    banner_w = min(W - 120, content_w + pad_x * 2)
    banner_h = 160
    banner_x = (W - banner_w) // 2
    banner_y = y_top
    
    # High-contrast dark obsidian glass backing
    draw.rounded_rectangle(
        [(banner_x, banner_y), (banner_x + banner_w, banner_y + banner_h)],
        radius=20,
        fill=(11, 15, 25, 240),
        outline=(255, 255, 255, 45),
        width=1
    )
    
    # Left colored accent bar
    draw.rounded_rectangle(
        [(banner_x + 8, banner_y + 16), (banner_x + 14, banner_y + banner_h - 16)],
        radius=3,
        fill=sub_color + (255,)
    )
    
    # Headline (crisp white with subtle shadow)
    tx_h = (W - w_h) // 2
    draw.text((tx_h + 1, banner_y + 30 + 1), headline, font=f_h, fill=(0, 0, 0, 200))
    draw.text((tx_h, banner_y + 30), headline, font=f_h, fill=C_WHITE)
    
    # Subline
    tx_s = (W - w_s) // 2
    draw.text((tx_s + 1, banner_y + 98 + 1), subline, font=f_s, fill=(0, 0, 0, 200))
    draw.text((tx_s, banner_y + 98), subline, font=f_s, fill=sub_color)


# Top Cinema Brand Bar
CHAPTERS = [
    ("01 THE COMMODITY TRAP", 0.0, 9.0),
    ("02 THE TURNING POINT", 9.0, 15.0),
    ("03 AUTONOMOUS ENGINE", 15.0, 25.5),
    ("04 UNSTOPPABLE SCALE", 25.5, 34.5)
]

def draw_cinema_brand_bar(draw, t):
    bar_y = 16
    draw.text((70, bar_y), "INOCONNECT", font=get_font(16, bold=True), fill=C_WHITE)
    draw.text((180, bar_y), "//", font=get_font(16, bold=True), fill=C_ACCENT)
    draw.text((200, bar_y), "CINEMATIC BRAND FILM", font=get_font(14, bold=False), fill=C_MUTED)
    
    for name, st, et in CHAPTERS:
        if st <= t < et:
            draw.ellipse([(W - 320, bar_y + 4), (W - 310, bar_y + 14)], fill=C_MINT)
            draw.text((W - 298, bar_y), name, font=get_font(14, bold=True), fill=C_MINT)
            break


def generate_frame(f_idx):
    t = f_idx / FPS
    
    # -------------------------------------------------------------
    # SCENE 1 (0.0s – 4.5s): THE COMMODITY TRAP (Agency Boardroom)
    # -------------------------------------------------------------
    if t < 4.5:
        p = t / 4.5
        scale = 1.0 + 0.08 * ease_in_out(p)
        iw, ih = IMG_OFFICE.size
        cw, ch = int(iw / scale), int(ih / scale)
        cropped = IMG_OFFICE.crop(((iw - cw)//2, (ih - ch)//2, (iw + cw)//2, (ih + ch)//2))
        base = cropped.resize((W, H), Image.Resampling.LANCZOS)
        
        stage = apply_cinematic_grade(base, contrast=1.15, warmth=0.96)
        draw = ImageDraw.Draw(stage, "RGBA")
        draw_cinema_brand_bar(draw, t)
        
        draw_cinematic_banner(
            stage,
            "MOST AGENCIES SELL ACTIVITY.",
            "HOURS LOGGED. MONTHLY RETAINERS. ZERO PIPELINE.",
            sub_color=C_ACCENT,
            y_top=760
        )
        return stage
        
    # -------------------------------------------------------------
    # SCENE 2 (4.5s – 9.0s): THE BROKEN PROMISE (Real Female Exec Video)
    # -------------------------------------------------------------
    elif t < 9.0:
        base = CLIP_EXEC.get_frame(t - 4.5)
        stage = apply_cinematic_grade(base, contrast=1.14, warmth=1.02)
        draw = ImageDraw.Draw(stage, "RGBA")
        draw_cinema_brand_bar(draw, t)
        
        draw_cinematic_banner(
            stage,
            "VANITY CLICKS DO NOT PAY PAYROLL.",
            "BUDGETS BURNED WHILE YOUR PIPELINE STALLS.",
            sub_color=C_MUTED,
            y_top=760
        )
        return stage

    # -------------------------------------------------------------
    # SCENE 3 (9.0s – 14.5s): THE SHIFT (Real Strategists Video)
    # -------------------------------------------------------------
    elif t < 14.5:
        base = CLIP_BOARD.get_frame(t - 9.0)
        stage = apply_cinematic_grade(base, contrast=1.16, warmth=1.05)
        draw = ImageDraw.Draw(stage, "RGBA")
        draw_cinema_brand_bar(draw, t)
        
        draw_cinematic_banner(
            stage,
            "STOP PAYING TO LEARN ON YOUR DIME.",
            "YOU NEED AN ENGINEERED REVENUE ENGINE.",
            sub_color=C_MINT,
            y_top=760
        )
        return stage

    # -------------------------------------------------------------
    # SCENE 4 (14.5s – 20.0s): AUTONOMOUS AI PIPELINE (3D Platform + Mobile)
    # -------------------------------------------------------------
    elif t < 20.0:
        p = (t - 14.5) / 5.5
        scale = 1.0 + 0.06 * ease_in_out(p)
        iw, ih = IMG_AUTO.size
        cw, ch = int(iw / scale), int(ih / scale)
        cropped = IMG_AUTO.crop(((iw - cw)//2, (ih - ch)//2, (iw + cw)//2, (ih + ch)//2))
        base = cropped.resize((W, H), Image.Resampling.LANCZOS)
        
        # Inset real mobile engagement video on top right
        mob_frame = CLIP_MOBILE.get_frame(t - 14.5)
        mob_w, mob_h = 440, 248
        mob_res = mob_frame.resize((mob_w, mob_h), Image.Resampling.LANCZOS)
        base.paste(mob_res, (W - mob_w - 80, 140))
        
        d_temp = ImageDraw.Draw(base)
        d_temp.rectangle([(W - mob_w - 82, 138), (W - 78, 140 + mob_h + 2)], outline=C_CYAN, width=2)
        d_temp.text((W - mob_w - 70, 150), "● LIVE BUYER QUALIFICATION", font=get_font(14, bold=True), fill=C_CYAN)
        
        stage = apply_cinematic_grade(base, contrast=1.15, warmth=1.0)
        draw = ImageDraw.Draw(stage, "RGBA")
        draw_cinema_brand_bar(draw, t)
        
        draw_cinematic_banner(
            stage,
            "AUTONOMOUS 24/7 AI LEAD PIPELINES.",
            "< 0.8s BUYER ROUTING • DIRECT-RESPONSE CONVERSION",
            sub_color=C_CYAN,
            y_top=760
        )
        return stage

    # -------------------------------------------------------------
    # SCENE 5 (20.0s – 25.5s): COMPOUNDING SCALE (Attribution + City Exec)
    # -------------------------------------------------------------
    elif t < 25.5:
        base = CLIP_CITY.get_frame(t - 20.0)
        stage = apply_cinematic_grade(base, contrast=1.18, warmth=1.04)
        draw = ImageDraw.Draw(stage, "RGBA")
        draw_cinema_brand_bar(draw, t)
        
        draw_cinematic_banner(
            stage,
            "MATHEMATICALLY PREDICTABLE SCALE.",
            "4.8x AVERAGE ROAS • 98% RETENTION • $38M+ REVENUE",
            sub_color=C_MINT,
            y_top=760
        )
        return stage

    # -------------------------------------------------------------
    # SCENE 6 (25.5s – 34.5s): THE CLIMAX & INVITATION (Growth Matrix + Logo)
    # -------------------------------------------------------------
    else:
        p = (t - 25.5) / 9.0
        scale = 1.0 + 0.05 * ease_in_out(p)
        iw, ih = IMG_GROWTH.size
        cw, ch = int(iw / scale), int(ih / scale)
        cropped = IMG_GROWTH.crop(((iw - cw)//2, (ih - ch)//2, (iw + cw)//2, (ih + ch)//2))
        base = cropped.resize((W, H), Image.Resampling.LANCZOS)
        
        stage = apply_cinematic_grade(base, contrast=1.20, warmth=1.02)
        draw = ImageDraw.Draw(stage, "RGBA")
        draw_cinema_brand_bar(draw, t)
        
        # Center Official InoConnect Logo
        if LOGO_IMG:
            lw = 240
            lh = int(lw * LOGO_IMG.height / LOGO_IMG.width)
            logo_res = LOGO_IMG.resize((lw, lh), Image.Resampling.LANCZOS)
            stage = stage.convert("RGBA")
            stage.alpha_composite(logo_res, ((W - lw)//2, 190))
            stage = stage.convert("RGB")
            draw = ImageDraw.Draw(stage, "RGBA")
            
        # Large High-Contrast Climax Card
        card_w, card_h = 1040, 360
        card_x = (W - card_w) // 2
        card_y = 350
        draw.rounded_rectangle([(card_x, card_y), (card_x + card_w, card_y + card_h)], radius=24, fill=(11, 15, 25, 245), outline=(255, 255, 255, 45), width=1)
        
        # Brand Name
        draw.text(((W - 320)//2, card_y + 24), "InoConnect", font=get_font(48, bold=True), fill=C_WHITE)
        
        # Stance headline
        t_call = "WE DON'T MANAGE CAMPAIGNS. WE ENGINEER PIPELINE."
        f_call = get_font(34, bold=True)
        b_c = draw.textbbox((0, 0), t_call, font=f_call)
        cw = b_c[2] - b_c[0]
        draw.text(((W - cw)//2, card_y + 92), t_call, font=f_call, fill=C_MINT)
        
        # Sub
        t_sub = "Direct-Response Creative  •  Autonomous AI  •  Compounding Revenue"
        f_sub = get_font(20, bold=False)
        b_s = draw.textbbox((0, 0), t_sub, font=f_sub)
        sw = b_s[2] - b_s[0]
        draw.text(((W - sw)//2, card_y + 144), t_sub, font=f_sub, fill=C_MUTED)
        
        # CTA Button
        btn_w, btn_h = 560, 68
        btn_x = (W - btn_w) // 2
        btn_y = card_y + 200
        pulse = 0.5 + 0.5 * math.sin(p * 8.0)
        draw.rounded_rectangle([(btn_x - 3, btn_y - 3), (btn_x + btn_w + 3, btn_y + btn_h + 3)], radius=36, fill=C_ACCENT + (int(120 * pulse),))
        draw.rounded_rectangle([(btn_x, btn_y), (btn_x + btn_w, btn_y + btn_h)], radius=34, fill=C_ACCENT + (255,))
        
        btn_txt = "CLAIM YOUR STRATEGIC GROWTH AUDIT →"
        f_b = get_font(20, bold=True)
        b_t = draw.textbbox((0, 0), btn_txt, font=f_b)
        bw = b_t[2] - b_t[0]
        draw.text(((W - bw)//2, btn_y + 22), btn_txt, font=f_b, fill=C_WHITE)
        
        draw.text(((W - 460)//2, card_y + 295), "inoconnect.com  •  Clutch 4.9/5  •  Zero Strings Attached", font=get_font(17, bold=True), fill=(148, 163, 184))
        return stage


def main():
    print(f"=== Rendering Master Brand Film (V2 Ultra Contrast) ===")
    print(f"Total: {TOTAL_FRAMES} frames @ 1920x1080 30FPS ({TOTAL_SEC}s)")
    
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
    
    pipe = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE)
    
    checkpoints = [
        int(2.2 * FPS),   # Scene 1: Boardroom
        int(6.8 * FPS),   # Scene 2: Female Exec Video
        int(11.8 * FPS),  # Scene 3: Strategists Video
        int(17.2 * FPS),  # Scene 4: AI Platform + Mobile
        int(22.8 * FPS),  # Scene 5: Scale + City Exec
        int(30.0 * FPS),  # Scene 6: Brand Crest & CTA
    ]
    contact_frames = []
    
    for i in range(TOTAL_FRAMES):
        frame = generate_frame(i)
        
        if i in checkpoints:
            contact_frames.append(frame.copy())
            
        pipe.stdin.write(frame.tobytes())
        
        if i % 120 == 0 or i == TOTAL_FRAMES - 1:
            print(f"  Frame {i}/{TOTAL_FRAMES} ({i/TOTAL_FRAMES*100:.1f}%) complete...")
            
    pipe.stdin.close()
    pipe.wait()
    print("Master video encoding complete.")
    
    # Storyboard Sheet
    sheet_w, sheet_h = 1920, 1080
    sheet = Image.new("RGB", (sheet_w, sheet_h), (11, 15, 25))
    draw_s = ImageDraw.Draw(sheet)
    
    cols = 3
    rows = 2
    tw, th = 560, 315
    gap_x = 40
    gap_y = 60
    start_x = (sheet_w - (cols * tw + (cols - 1) * gap_x)) // 2
    start_y = 120
    
    titles = [
        "1. THE COMMODITY TRAP (EXECUTIVE BOARDROOM)",
        "2. VANITY METRICS VS REVENUE (REAL EXEC FOOTAGE)",
        "3. THE TURNING POINT (STRATEGISTS PLANNING)",
        "4. AUTONOMOUS AI PIPELINE (3D PLATFORM + MOBILE)",
        "5. MATHEMATICALLY PREDICTABLE SCALE (CITY EXEC)",
        "6. INOCONNECT BRAND CREST & STRATEGIC AUDIT"
    ]
    
    draw_s.text((start_x, 45), "INOCONNECT — BROADCAST BRAND STORY FILM", font=get_font(28, bold=True), fill=C_WHITE)
    draw_s.text((sheet_w - start_x - 480, 52), "REAL VIDEO BLEND • GEMINI NARRATION • 1080P", font=get_font(18, bold=True), fill=C_MINT)
    
    for idx, f in enumerate(contact_frames[:6]):
        thumb = f.resize((tw, th), Image.Resampling.LANCZOS)
        r = idx // cols
        c = idx % cols
        x = start_x + c * (tw + gap_x)
        y = start_y + r * (th + gap_y)
        sheet.paste(thumb, (x, y))
        draw_s.text((x, y - 28), titles[idx], font=get_font(14, bold=True), fill=C_ACCENT)
        draw_s.rectangle([(x - 1, y - 1), (x + tw, y + th)], outline=(255, 255, 255, 60), width=1)
        
    sheet.save(STORYBOARD_JPG, quality=95)
    print(f"Saved Storyboard to: {STORYBOARD_JPG}")
    
    # Audio Muxing
    cmd_mux = [
        FFMPEG, "-y",
        "-i", RAW_MP4,
        "-i", MASTERED_AUDIO,
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "256k",
        "-shortest",
        "-movflags", "+faststart",
        FINAL_MP4
    ]
    subprocess.run(cmd_mux, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    shutil.copy2(FINAL_MP4, DOWNLOADS_COPY)
    print(f"Final Film Ready: {FINAL_MP4}")
    print(f"Copied to User Downloads: {DOWNLOADS_COPY}")
    
    if os.path.exists(RAW_MP4):
        os.remove(RAW_MP4)
        
    print("=== Master Brand Film Successfully Generated! ===")

if __name__ == "__main__":
    main()
