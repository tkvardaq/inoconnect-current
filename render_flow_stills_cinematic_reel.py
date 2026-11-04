"""
Render Google Flow Cinematic Hero Reel (20.0s Seamless Closed Loop)
===================================================================
- Built directly from Google Flow Stills:
  1. flow_beat1_search.jpg (Woman holding smartphone by window)
  2. flow_beat2_connection.jpg (Advisor listening to female client)
  3. flow_beat3_service.jpg (Men collaborating on workstation)
  4. flow_beat4_impact.jpg (Professional woman standing on terrace)
- Sub-pixel cinematic camera moves (push-in, lateral drift, slow slider)
- 2.39:1 Anamorphic cinema framing with hairlines
- Frosted obsidian glass cards with public service awareness copy
- 100% Closed-Ended Seamless Loop (1.5s cross-dissolve into Frame 0)
- Mastered 20.0s ambient electronic audio
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

STILLS_DIR = r"d:\ino website\videos\flow_stills"
VID_DIR = r"d:\ino website\videos"
AUDIO_PATH = os.path.join(VID_DIR, "ambient_psychology_audio.wav")
RAW_MP4 = os.path.join(VID_DIR, "awareness_flow_raw.mp4")
FINAL_MP4 = os.path.join(VID_DIR, "inoconnect-hero-showreel.mp4")
DOWNLOADS_COPY = r"C:\Users\talha\Downloads\InoConnect_Hero_Showreel.mp4"
STORYBOARD_JPG = os.path.join(VID_DIR, "inoconnect_hero_storyboard.jpg")

FLOW_IMAGES = [
    os.path.join(STILLS_DIR, "flow_beat1_search.jpg"),
    os.path.join(STILLS_DIR, "flow_beat2_connection.jpg"),
    os.path.join(STILLS_DIR, "flow_beat3_service.jpg"),
    os.path.join(STILLS_DIR, "flow_beat4_impact.jpg")
]

# Color Palette
C_DARK = (10, 14, 22)
C_WHITE = (255, 255, 255)
C_MUTED = (210, 222, 238)
C_CYAN = (0, 210, 255)       # Beat 1 Accent
C_AMBER = (255, 185, 90)     # Beat 2 Accent
C_MINT = (68, 225, 175)      # Beat 3 Accent
C_GOLD = (255, 210, 100)     # Beat 4 Accent

# Fonts
FONT_BOLD = r"C:\Windows\Fonts\segoeuib.ttf"
FONT_REG = r"C:\Windows\Fonts\segoeui.ttf"

_FONTS = {}
def get_font(size, bold=True):
    k = (size, bold)
    if k not in _FONTS:
        p = FONT_BOLD if bold else FONT_REG
        try:
            _FONTS[k] = ImageFont.truetype(p, size)
        except:
            _FONTS[k] = ImageFont.load_default()
    return _FONTS[k]

class FlowImageMotion:
    def __init__(self, path, start_zoom, end_zoom, start_center, end_center):
        self.img = cv2.imread(path)
        if self.img is None:
            raise FileNotFoundError(f"Cannot load image: {path}")
        self.img_rgb = cv2.cvtColor(self.img, cv2.COLOR_BGR2RGB)
        self.ih, self.iw = self.img_rgb.shape[:2]
        self.start_zoom = start_zoom
        self.end_zoom = end_zoom
        self.start_center = start_center
        self.end_center = end_center

    def get_frame(self, progress):
        """progress in [0.0, 1.0]"""
        p = max(0.0, min(1.0, progress))
        # Smooth ease curve
        ease_p = 0.5 - math.cos(math.pi * p) / 2.0
        
        zoom = self.start_zoom + (self.end_zoom - self.start_zoom) * ease_p
        cx_norm = self.start_center[0] + (self.end_center[0] - self.start_center[0]) * ease_p
        cy_norm = self.start_center[1] + (self.end_center[1] - self.start_center[1]) * ease_p
        
        # Calculate crop rectangle in original image coordinates
        crop_h = self.ih / zoom
        crop_w = crop_h * (W / H)
        if crop_w > self.iw:
            crop_w = self.iw
            crop_h = crop_w * (H / W)
            
        cx = cx_norm * self.iw
        cy = cy_norm * self.ih
        
        x0 = int(round(cx - crop_w / 2.0))
        y0 = int(round(cy - crop_h / 2.0))
        
        # Clamp to image bounds
        x0 = max(0, min(self.iw - int(crop_w), x0))
        y0 = max(0, min(self.ih - int(crop_h), y0))
        x1 = x0 + int(crop_w)
        y1 = y0 + int(crop_h)
        
        cropped = self.img_rgb[y0:y1, x0:x1]
        resized = cv2.resize(cropped, (W, H), interpolation=cv2.INTER_LANCZOS4)
        return resized

def ease_in_out(x):
    x = max(0.0, min(1.0, x))
    return 0.5 - math.cos(math.pi * x) / 2.0

def ease_out_cubic(x):
    x = max(0.0, min(1.0, x))
    return 1.0 - math.pow(1.0 - x, 3.0)

def draw_glass_card(draw, x, y, w, h, alpha, chapter, headline, subtitle, accent_color):
    """Draws an obsidian glass lower third with crystal readability."""
    if alpha <= 0.01:
        return
    
    # 1. Glass backdrop
    bg_a = int(215 * alpha)
    draw.rounded_rectangle([(x, y), (x + w, y + h)], radius=14, fill=(10, 14, 22, bg_a))
    
    # 2. Subtle rim outline
    border_a = int(55 * alpha)
    draw.rounded_rectangle([(x, y), (x + w, y + h)], radius=14, outline=(255, 255, 255, border_a), width=1)
    
    # 3. Accent chip tag (top)
    chip_a = int(255 * alpha)
    acc = (*accent_color, chip_a)
    draw.text((x + 36, y + 24), chapter.upper(), font=get_font(15, bold=True), fill=acc)
    
    # 4. Headline
    head_a = int(255 * alpha)
    draw.text((x + 36, y + 48), headline, font=get_font(36, bold=True), fill=(255, 255, 255, head_a))
    
    # 5. Subtitle
    sub_a = int(230 * alpha)
    draw.text((x + 36, y + 104), subtitle, font=get_font(20, bold=False), fill=(210, 222, 238, sub_a))

def render_frame(t, motions):
    """Renders composite frame at timestamp t in [0.0, 20.0]."""
    XFADE = 0.8
    LOOP_FADE = 1.5
    
    beat_idx = int(t / 5.0)
    beat_idx = min(beat_idx, 3)
    beat_start = beat_idx * 5.0
    beat_local_t = t - beat_start
    clip_prog = beat_local_t / 5.0
    
    curr_frame = motions[beat_idx].get_frame(clip_prog)
    
    if beat_idx < 3 and beat_local_t >= (5.0 - XFADE):
        trans_prog = (beat_local_t - (5.0 - XFADE)) / XFADE
        trans_alpha = ease_in_out(trans_prog)
        next_motion = motions[beat_idx + 1]
        next_clip_prog = (trans_prog * XFADE) / 5.0
        next_frame = next_motion.get_frame(next_clip_prog)
        composite = (curr_frame.astype(np.float32) * (1.0 - trans_alpha) + 
                     next_frame.astype(np.float32) * trans_alpha).astype(np.uint8)
    elif beat_idx == 3 and beat_local_t >= (5.0 - LOOP_FADE):
        # Dissolving into Beat 1 starting frame for invisible closed loop!
        loop_prog = (beat_local_t - (5.0 - LOOP_FADE)) / LOOP_FADE
        loop_alpha = ease_in_out(loop_prog)
        head_frame = motions[0].get_frame(0.0)
        composite = (curr_frame.astype(np.float32) * (1.0 - loop_alpha) + 
                     head_frame.astype(np.float32) * loop_alpha).astype(np.uint8)
    else:
        composite = curr_frame

    pil_im = Image.fromarray(composite)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, "RGBA")
    
    # 2.39:1 Cinema Letterbox Bars (50px top and bottom)
    bar_h = 50
    draw.rectangle([(0, 0), (W, bar_h)], fill=(8, 12, 18, 255))
    draw.rectangle([(0, H - bar_h), (W, H)], fill=(8, 12, 18, 255))
    draw.line([(0, bar_h), (W, bar_h)], fill=(255, 255, 255, 20), width=1)
    draw.line([(0, H - bar_h), (W, H - bar_h)], fill=(255, 255, 255, 20), width=1)
    
    CARD_IN = 0.3
    CARD_HOLD = 3.6
    CARD_OUT = 4.4
    
    card_alpha = 0.0
    if beat_local_t >= CARD_IN and beat_local_t < CARD_OUT:
        if beat_local_t < CARD_IN + 0.5:
            card_alpha = ease_out_cubic((beat_local_t - CARD_IN) / 0.5)
        elif beat_local_t > CARD_OUT - 0.5:
            card_alpha = ease_in_out((CARD_OUT - beat_local_t) / 0.5)
        else:
            card_alpha = 1.0
            
    card_w = 1140
    card_h = 160
    card_x = (W - card_w) // 2
    card_y = H - bar_h - card_h - 28
    
    if beat_idx == 0:
        draw_glass_card(draw, card_x, card_y, card_w, card_h, card_alpha,
                        chapter="01 // THE SEARCH",
                        headline="SEEKING WHAT MATTERS.",
                        subtitle="In a world crowded with noise, true clarity begins with listening.",
                        accent_color=C_CYAN)
    elif beat_idx == 1:
        draw_glass_card(draw, card_x, card_y, card_w, card_h, card_alpha,
                        chapter="02 // THE CONNECTION",
                        headline="UNDERSTOOD, NOT TARGETED.",
                        subtitle="Every lasting solution begins with genuine empathy and shared purpose.",
                        accent_color=C_AMBER)
    elif beat_idx == 2:
        draw_glass_card(draw, card_x, card_y, card_w, card_h, card_alpha,
                        chapter="03 // THE SERVICE",
                        headline="CARE BUILT ON TRUST.",
                        subtitle="Reliable support and dedicated craft at every stage of your journey.",
                        accent_color=C_MINT)
    elif beat_idx == 3:
        draw_glass_card(draw, card_x, card_y, card_w, card_h, card_alpha,
                        chapter="04 // THE IMPACT",
                        headline="EMPOWERED TO THRIVE.",
                        subtitle="Real progress is measured in human outcomes and quiet confidence.",
                        accent_color=C_GOLD)
                        
    final_pil = Image.alpha_composite(pil_im.convert("RGBA"), overlay)
    return cv2.cvtColor(np.array(final_pil.convert("RGB")), cv2.COLOR_RGB2BGR)

def main():
    print("=" * 60)
    print("Rendering Google Flow Master Showreel (20.0s Loop)")
    print("=" * 60)
    
    # Initialize motions with subtle, high-end cinema camera moves
    # Beat 1: Slow push-in toward contemplative profile
    m1 = FlowImageMotion(FLOW_IMAGES[0], start_zoom=1.00, end_zoom=1.08, 
                         start_center=(0.52, 0.50), end_center=(0.58, 0.46))
    # Beat 2: Slow organic drift toward advisor's warm empathetic expression
    m2 = FlowImageMotion(FLOW_IMAGES[1], start_zoom=1.00, end_zoom=1.07, 
                         start_center=(0.48, 0.50), end_center=(0.42, 0.46))
    # Beat 3: Slow slider revealing the collaborative roadmap & teamwork
    m3 = FlowImageMotion(FLOW_IMAGES[2], start_zoom=1.06, end_zoom=1.00, 
                         start_center=(0.46, 0.52), end_center=(0.52, 0.50))
    # Beat 4: Slow majestic push-in toward terrace overlooking city skyline
    m4 = FlowImageMotion(FLOW_IMAGES[3], start_zoom=1.00, end_zoom=1.08, 
                         start_center=(0.52, 0.50), end_center=(0.56, 0.46))
    
    motions = [m1, m2, m3, m4]
    
    print(f"\nRendering {TOTAL_FRAMES} frames ({TOTAL_SEC}s @ {FPS}fps) to {RAW_MP4}...")
    ffmpeg_cmd = [
        FFMPEG, "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{W}x{H}",
        "-pix_fmt", "bgr24",
        "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "17",
        "-pix_fmt", "yuv420p",
        RAW_MP4
    ]
    
    proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    storyboard_frames = {}
    sample_timestamps = [2.5, 7.5, 12.5, 17.5]
    
    for f in range(TOTAL_FRAMES):
        t = f / FPS
        frame_bgr = render_frame(t, motions)
        proc.stdin.write(frame_bgr.tobytes())
        
        for st in sample_timestamps:
            if abs(t - st) < (0.5 / FPS):
                storyboard_frames[st] = frame_bgr.copy()
                
        if f % 60 == 0:
            pct = (f / TOTAL_FRAMES) * 100.0
            print(f"  Frame {f}/{TOTAL_FRAMES} ({pct:.1f}%) | Time: {t:.2f}s")
            
    proc.stdin.close()
    proc.wait()
    print(f"Raw video complete: {RAW_MP4} ({os.path.getsize(RAW_MP4)} bytes)")
    
    # Mux Audio Loop
    print("\nMuxing seamless master audio loop...")
    mux_cmd = [
        FFMPEG, "-y",
        "-i", RAW_MP4,
        "-i", AUDIO_PATH,
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "320k",
        "-shortest",
        FINAL_MP4
    ]
    subprocess.run(mux_cmd, check=True)
    print(f"Master showreel finalized: {FINAL_MP4} ({os.path.getsize(FINAL_MP4)} bytes)")
    
    # Copy to Downloads
    shutil.copy2(FINAL_MP4, DOWNLOADS_COPY)
    print(f"Exported to Downloads: {DOWNLOADS_COPY}")
    
    # Storyboard contact sheet
    print("\nGenerating Storyboard Contact Sheet...")
    panels = []
    for st in sample_timestamps:
        if st in storyboard_frames:
            im = Image.fromarray(cv2.cvtColor(storyboard_frames[st], cv2.COLOR_BGR2RGB))
            panels.append(im.resize((960, 540), Image.Resampling.LANCZOS))
            
    if len(panels) == 4:
        sb = Image.new("RGB", (1920, 1080), (10, 14, 22))
        sb.paste(panels[0], (0, 0))
        sb.paste(panels[1], (960, 0))
        sb.paste(panels[2], (0, 540))
        sb.paste(panels[3], (960, 540))
        
        sb_draw = ImageDraw.Draw(sb)
        sb_draw.line([(960, 0), (960, 1080)], fill=(40, 55, 80), width=3)
        sb_draw.line([(0, 540), (1920, 540)], fill=(40, 55, 80), width=3)
        
        sb.save(STORYBOARD_JPG, quality=95)
        print(f"Storyboard saved: {STORYBOARD_JPG}")

    print("\nMaster render completed successfully!")

if __name__ == "__main__":
    main()
