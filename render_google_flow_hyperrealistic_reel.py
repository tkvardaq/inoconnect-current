"""
InoConnect Hyper-Realistic Google Flow Hero Reel (20.0s Seamless Closed Loop)
=============================================================================
- Built 100% using Google Flow hyper-realistic AI video footage
- 4 Beats of Consumer Psychology:
  1. 00:00 - 00:05 | ATTENTION: THEY STOP. (Spotlight Smartphone Focus)
  2. 00:05 - 00:10 | EMOTION:   THEY FEEL. (Luxury Product Unboxing Joy)
  3. 00:10 - 00:15 | CERTAINTY: THEY BELIEVE. (Frictionless Doorstep Delivery)
  4. 00:15 - 00:20 | ACTION:    THEY CHOOSE YOU. (Confident Sunlit Brand Advocacy)
- Seamless 1.5s Closed Loop: Scene 4 cross-dissolves into Scene 1's opening frame
- Minimal luxury typography: Just 2 words per beat on obsidian glass card
- Anamorphic 2.39:1 Cinema Letterbox with blue accent line
- 20.0s Seamless Master Audio Loop
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

VID_DIR = r"D:\videos for reels"
DOWNLOADS = r"C:\Users\talha\Downloads"
OUT_DIR = r"d:\ino website\videos"
FONT_PATH = r"D:\videos for reels\fonts\Outfit-Variable.ttf"
AUDIO_LOOP = os.path.join(OUT_DIR, "ambient_psychology_audio.wav")

RAW_MP4 = os.path.join(OUT_DIR, "flow_raw.mp4")
FINAL_MP4 = os.path.join(OUT_DIR, "inoconnect-hero-showreel.mp4")
DOWNLOADS_COPY = r"C:\Users\talha\Downloads\InoConnect_Hero_Showreel.mp4"
STORYBOARD_JPG = os.path.join(OUT_DIR, "inoconnect_hero_storyboard.jpg")

os.makedirs(OUT_DIR, exist_ok=True)

# Identify Google Flow Video Files
fn_ten_people = [f for f in os.listdir(DOWNLOADS) if "Ten_people" in f][0]
p_clip1 = os.path.join(DOWNLOADS, fn_ten_people)
p_clip2 = os.path.join(VID_DIR, "Woman_opening_leather_handbag_box_b5258172.mp4")
fn_parcel = [f for f in os.listdir(VID_DIR) if "Parcels" in f][0]
p_clip3 = os.path.join(VID_DIR, fn_parcel)
p_clip4 = os.path.join(VID_DIR, "Woman_walking_from_cafe_e3ba0da2.mp4")

# Typography & Colors
C_DARK = (8, 11, 17)
C_PRIMARY = (65, 105, 225)
C_CYAN = (0, 210, 255)
C_ACCENT = (255, 117, 24)
C_MINT = (68, 215, 168)
C_GOLD = (255, 195, 75)
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

class FlowVideoReader:
    def __init__(self, path, y_bias=0.25):
        self.cap = cv2.VideoCapture(path)
        self.total = int(self.cap.get(cv2.CAP_PROP_FRAME_COUNT))
        self.fps = self.cap.get(cv2.CAP_PROP_FPS) or 24.0
        self.y_bias = y_bias
        
    def get_16x9_frame(self, target_sec):
        f_num = int((target_sec * self.fps) % self.total)
        self.cap.set(cv2.CAP_PROP_POS_FRAMES, f_num)
        ret, frame = self.cap.read()
        if ret:
            h, w = frame.shape[:2]
            scale = W / w
            nw, nh = int(w * scale), int(h * scale)
            resized = cv2.resize(frame, (nw, nh), interpolation=cv2.INTER_LANCZOS4)
            
            max_y = nh - H
            crop_y = int(max_y * self.y_bias)
            cropped = resized[crop_y:crop_y+H, 0:W]
            return Image.fromarray(cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB))
        return Image.new("RGB", (W, H), (8, 11, 17))

READER_1 = FlowVideoReader(p_clip1, y_bias=0.25)  # Ten people spotlight
READER_2 = FlowVideoReader(p_clip2, y_bias=0.20)  # Unboxing joy
READER_3 = FlowVideoReader(p_clip3, y_bias=0.25)  # Doorstep delivery
READER_4 = FlowVideoReader(p_clip4, y_bias=0.15)  # Walking in sunlight

def ease_in_out(x):
    return 0.5 - math.cos(math.pi * x) / 2

def ease_out_cubic(x):
    return 1 - math.pow(1 - x, 3)

def apply_cinematic_grade(im, contrast=1.12, warmth=1.02):
    arr = np.array(im, dtype=np.float32)
    arr[:, :, 0] = np.clip(arr[:, :, 0] * warmth, 0, 255)
    arr[:, :, 2] = np.clip(arr[:, :, 2] * (2.0 - warmth), 0, 255)
    mean = 128.0
    arr = np.clip((arr - mean) * contrast + mean, 0, 255)
    
    graded = Image.fromarray(arr.astype(np.uint8))
    draw = ImageDraw.Draw(graded, "RGBA")
    
    # 2.39:1 Cinema Letterbox Bars (56px)
    bar_h = 56
    draw.rectangle([(0, 0), (W, bar_h)], fill=(8, 11, 17, 255))
    draw.rectangle([(0, H - bar_h), (W, H)], fill=(8, 11, 17, 255))
    draw.line([(0, bar_h), (W, bar_h)], fill=(65, 105, 225, 90), width=1)
    draw.line([(0, H - bar_h), (W, H - bar_h)], fill=(65, 105, 225, 90), width=1)
    return graded

def draw_luxury_headline(canvas, tag_text, main_text, tag_color=C_CYAN, alpha_factor=1.0, y_pos=780):
    if alpha_factor <= 0.01:
        return
        
    draw = ImageDraw.Draw(canvas, "RGBA")
    alpha = int(255 * alpha_factor)
    
    f_tag = get_font(16, bold=True)
    f_main = get_font(70, bold=True)
    
    b_tag = draw.textbbox((0, 0), tag_text, font=f_tag)
    w_tag = b_tag[2] - b_tag[0]
    
    b_main = draw.textbbox((0, 0), main_text, font=f_main)
    w_main = b_main[2] - b_main[0]
    
    content_w = max(w_tag, w_main)
    pad_x = 64
    box_w = min(W - 120, content_w + pad_x * 2)
    box_h = 132
    box_x = (W - box_w) // 2
    box_y = y_pos
    
    a_bg = int(238 * alpha_factor)
    a_border = int(45 * alpha_factor)
    
    # Dark obsidian glass card
    draw.rounded_rectangle(
        [(box_x, box_y), (box_x + box_w, box_y + box_h)],
        radius=20,
        fill=(8, 11, 17, a_bg),
        outline=(255, 255, 255, a_border),
        width=1
    )
    
    # Left vertical colored pip
    draw.rounded_rectangle(
        [(box_x + 8, box_y + 16), (box_x + 13, box_y + box_h - 16)],
        radius=3,
        fill=tag_color + (alpha,)
    )
    
    # Tag
    draw.text(((W - w_tag)//2, box_y + 20), tag_text, font=f_tag, fill=tag_color + (int(alpha * 0.95),))
    
    # Main Headline
    tx = (W - w_main) // 2
    ty = box_y + 44
    draw.text((tx + 1, ty + 1), main_text, font=f_main, fill=(0, 0, 0, int(alpha * 0.85)))
    draw.text((tx, ty), main_text, font=f_main, fill=(255, 255, 255, alpha))

def calculate_fade(t_local, duration=5.0, fade_in=0.5, fade_out=0.5):
    if t_local < fade_in:
        return ease_out_cubic(t_local / fade_in)
    elif t_local > (duration - fade_out):
        return ease_out_cubic((duration - t_local) / fade_out)
    return 1.0

def render_frame(f_idx):
    t = f_idx / FPS
    
    # -------------------------------------------------------------
    # BEAT 1 (0.0s – 5.0s): THEY STOP. (Spotlight Smartphone Focus)
    # -------------------------------------------------------------
    if t < 5.0:
        base = READER_1.get_16x9_frame(t)
        stage = apply_cinematic_grade(base, contrast=1.14, warmth=1.03)
        fade = calculate_fade(t, duration=5.0, fade_in=0.5, fade_out=0.5)
        draw_luxury_headline(stage, "01 // ATTENTION", "THEY STOP.", tag_color=C_CYAN, alpha_factor=fade)
        return stage
        
    # -------------------------------------------------------------
    # BEAT 2 (5.0s – 10.0s): THEY FEEL. (Luxury Product Unboxing Joy)
    # -------------------------------------------------------------
    elif t < 10.0:
        t_rel = t - 5.0
        base = READER_2.get_16x9_frame(t_rel)
        stage = apply_cinematic_grade(base, contrast=1.12, warmth=1.04)
        fade = calculate_fade(t_rel, duration=5.0, fade_in=0.5, fade_out=0.5)
        draw_luxury_headline(stage, "02 // EMOTION", "THEY FEEL.", tag_color=C_ACCENT, alpha_factor=fade)
        return stage
        
    # -------------------------------------------------------------
    # BEAT 3 (10.0s – 15.0s): THEY BELIEVE. (Doorstep Delivery Trust)
    # -------------------------------------------------------------
    elif t < 15.0:
        t_rel = t - 10.0
        base = READER_3.get_16x9_frame(t_rel)
        stage = apply_cinematic_grade(base, contrast=1.13, warmth=1.02)
        fade = calculate_fade(t_rel, duration=5.0, fade_in=0.5, fade_out=0.5)
        draw_luxury_headline(stage, "03 // CERTAINTY", "THEY BELIEVE.", tag_color=C_MINT, alpha_factor=fade)
        return stage
        
    # -------------------------------------------------------------
    # BEAT 4 (15.0s – 20.0s): THEY CHOOSE YOU. (Sunlit Brand Advocacy & Loop)
    # -------------------------------------------------------------
    else:
        t_rel = t - 15.0
        f4 = READER_4.get_16x9_frame(t_rel)
        
        # SEAMLESS LOOP CROSS-DISSOLVE (Last 1.5 seconds -> Scene 1 opening frame)
        if t >= 18.5:
            loop_p = (t - 18.5) / 1.5
            f1_start = READER_1.get_16x9_frame(t - 18.5)
            base = Image.blend(f4, f1_start, ease_in_out(loop_p))
        else:
            base = f4
            
        stage = apply_cinematic_grade(base, contrast=1.14, warmth=1.04)
        
        fade = calculate_fade(t_rel, duration=5.0, fade_in=0.5, fade_out=1.6)
        draw_luxury_headline(stage, "04 // ACTION", "THEY CHOOSE YOU.", tag_color=C_GOLD, alpha_factor=fade)
        return stage

def main():
    print("=== Rendering Google Flow Hyper-Realistic Hero Reel ===")
    print(f"Total: {TOTAL_FRAMES} frames @ 1920x1080 30FPS ({TOTAL_SEC}s)")
    print("Seamless Loop Cross-Dissolve: 18.5s – 20.0s into 0.0s – 1.5s")
    
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
        585    # Loop seam (19.5s)
    ]
    saved_thumbs = []
    
    for f in range(TOTAL_FRAMES):
        frame = render_frame(f)
        proc.stdin.write(frame.tobytes())
        
        if f in storyboard_frames:
            saved_thumbs.append(frame.copy())
            
        if f % 75 == 0:
            pct = (f / TOTAL_FRAMES) * 100
            print(f"  Frame {f}/{TOTAL_FRAMES} ({pct:.1f}%) rendered...")
            
    proc.stdin.close()
    proc.wait()
    print("Raw video finished. Muxing with seamless audio...")
    
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
    print(f"Final film created: {FINAL_MP4}")
    
    # Copy to downloads
    shutil.copy2(FINAL_MP4, DOWNLOADS_COPY)
    print(f"Copied to downloads: {DOWNLOADS_COPY}")
    
    # Storyboard sheet
    print("Generating storyboard contact sheet...")
    sw, sh = 1920, 1080
    sheet = Image.new("RGB", (sw, sh), (8, 11, 17))
    s_draw = ImageDraw.Draw(sheet)
    
    s_draw.text((70, 45), "INOCONNECT // HYPER-REALISTIC GOOGLE FLOW SHOWREEL", font=get_font(28, bold=True), fill=C_WHITE)
    s_draw.text((sw - 450, 48), "SEAMLESS CLOSED LOOP • 20.0s @ 1080P", font=get_font(16, bold=True), fill=C_CYAN)
    
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
    tw, th = 860, 484
    
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
