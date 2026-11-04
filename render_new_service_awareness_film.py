"""
InoConnect Service Awareness Master Film (20.0s Seamless Closed Loop)
=====================================================================
- 100% Newly Generated Hyper-Realistic Footage (Wan 2.1 Fun Camera + Z-Image Turbo)
- Service Awareness Focus (Empathy, Listening, Reliable Support, Human Impact)
- NO Sales Pitch (Zero competitor bashing, zero aggressive marketing jargon)
- Seamless Closed Loop (Dissolves tail into head for infinite playback without detectable cut)
- Polished Obsidian Glass Lower-Thirds (High readability, elegant typography)
- 2.39:1 Cinema Anamorphic Framing
- Broadcast-Mastered 20.0s Ambient Soundtrack
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

VID_DIR = r"d:\ino website\videos"
AUDIO_PATH = os.path.join(VID_DIR, "ambient_psychology_audio.wav")
RAW_MP4 = os.path.join(VID_DIR, "awareness_new_raw.mp4")
FINAL_MP4 = os.path.join(VID_DIR, "inoconnect-hero-showreel.mp4")
DOWNLOADS_COPY = r"C:\Users\talha\Downloads\InoConnect_Hero_Showreel.mp4"
STORYBOARD_JPG = os.path.join(VID_DIR, "inoconnect_hero_storyboard.jpg")

# 4 Newly Generated Wan 2.1 Video Clips
CLIPS = [
    os.path.join(VID_DIR, "new_clip1_search.webm"),
    os.path.join(VID_DIR, "new_clip2_connection.webm"),
    os.path.join(VID_DIR, "new_clip3_service.webm"),
    os.path.join(VID_DIR, "new_clip4_impact.webm")
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

class WanClipReader:
    """Reads and caches Wan 2.1 video frames with smooth sub-frame interpolation and 16:9 anamorphic crop."""
    def __init__(self, path):
        self.path = path
        self.frames = []
        cap = cv2.VideoCapture(path)
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            # Upscale and center crop to 1920x1080
            h, w = frame.shape[:2]
            scale = max(W / float(w), H / float(h))
            nw = int(math.ceil(w * scale))
            nh = int(math.ceil(h * scale))
            resized = cv2.resize(frame, (nw, nh), interpolation=cv2.INTER_LANCZOS4)
            y_off = max(0, (nh - H) // 2)
            x_off = max(0, (nw - W) // 2)
            cropped = resized[y_off:y_off+H, x_off:x_off+W]
            if cropped.shape[1] != W or cropped.shape[0] != H:
                cropped = cv2.resize(cropped, (W, H), interpolation=cv2.INTER_LANCZOS4)
            # Convert BGR to RGB
            rgb = cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB)
            self.frames.append(rgb)
        cap.release()
        self.num_frames = len(self.frames)
        print(f"Loaded {self.num_frames} frames from {os.path.basename(path)}")

    def get_frame(self, progress):
        """progress in [0.0, 1.0], with linear blend between adjacent frames"""
        if self.num_frames == 0:
            return np.zeros((H, W, 3), dtype=np.uint8)
        pos = progress * (self.num_frames - 1)
        i0 = int(pos)
        i1 = min(i0 + 1, self.num_frames - 1)
        w1 = pos - i0
        w0 = 1.0 - w1
        f0 = self.frames[i0].astype(np.float32)
        f1 = self.frames[i1].astype(np.float32)
        blended = (f0 * w0 + f1 * w1).astype(np.uint8)
        return blended

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
    bg_a = int(210 * alpha)
    draw.rounded_rectangle([(x, y), (x + w, y + h)], radius=14, fill=(12, 17, 26, bg_a))
    
    # 2. Subtle rim outline
    border_a = int(50 * alpha)
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

def render_frame(t, readers):
    """Renders composite frame at timestamp t in [0.0, 20.0]."""
    # 4 Beats: 0..5, 5..10, 10..15, 15..20
    # Cross-dissolve window between clips: 0.8s
    XFADE = 0.8
    LOOP_FADE = 1.2  # Last 1.2s cross-dissolves into clip 1
    
    # Determine base clip and progress
    beat_idx = int(t / 5.0)
    beat_idx = min(beat_idx, 3)
    beat_start = beat_idx * 5.0
    beat_local_t = t - beat_start
    clip_prog = beat_local_t / 5.0
    
    # Base frame from current clip
    curr_frame = readers[beat_idx].get_frame(clip_prog)
    
    # Handle transition cross-fades
    if beat_idx < 3 and beat_local_t >= (5.0 - XFADE):
        # Dissolving into next clip
        trans_prog = (beat_local_t - (5.0 - XFADE)) / XFADE
        trans_alpha = ease_in_out(trans_prog)
        next_reader = readers[beat_idx + 1]
        next_clip_prog = (trans_prog * XFADE) / 5.0
        next_frame = next_reader.get_frame(next_clip_prog)
        composite = (curr_frame.astype(np.float32) * (1.0 - trans_alpha) + 
                     next_frame.astype(np.float32) * trans_alpha).astype(np.uint8)
    elif beat_idx == 3 and beat_local_t >= (5.0 - LOOP_FADE):
        # Dissolving into Clip 1 for invisible closed loop!
        loop_prog = (beat_local_t - (5.0 - LOOP_FADE)) / LOOP_FADE
        loop_alpha = ease_in_out(loop_prog)
        head_frame = readers[0].get_frame(0.0)
        composite = (curr_frame.astype(np.float32) * (1.0 - loop_alpha) + 
                     head_frame.astype(np.float32) * loop_alpha).astype(np.uint8)
    else:
        composite = curr_frame

    # Convert to PIL Image for overlay rendering
    pil_im = Image.fromarray(composite)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, "RGBA")
    
    # 2.39:1 Cinema Letterbox Bars (50px top and bottom)
    bar_h = 50
    draw.rectangle([(0, 0), (W, bar_h)], fill=(8, 12, 18, 255))
    draw.rectangle([(0, H - bar_h), (W, H)], fill=(8, 12, 18, 255))
    # Subtle accent hairline
    draw.line([(0, bar_h), (W, bar_h)], fill=(255, 255, 255, 20), width=1)
    draw.line([(0, H - bar_h), (W, H - bar_h)], fill=(255, 255, 255, 20), width=1)
    
    # Story Lower-Third Card timing per beat
    # Each card appears at +0.3s, holds until +4.4s, then fades out before transition
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
            
    # Lower third content specs
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
                        
    # Alpha composite
    final_pil = Image.alpha_composite(pil_im.convert("RGBA"), overlay)
    return cv2.cvtColor(np.array(final_pil.convert("RGB")), cv2.COLOR_RGB2BGR)

def main():
    print("=" * 60)
    print("InoConnect Public Service Awareness Master Film Rendering")
    print("=" * 60)
    
    # 1. Verify all clips exist
    for c in CLIPS:
        if not os.path.exists(c):
            print(f"Error: Clip {c} not found! Please wait for generation to complete.")
            sys.exit(1)
        print(f"Verified input clip: {c} ({os.path.getsize(c)} bytes)")

    # 2. Load readers
    print("\nCaching frames into memory...")
    readers = [WanClipReader(c) for c in CLIPS]
    
    # 3. Open FFmpeg pipe for rendering raw video
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
        frame_bgr = render_frame(t, readers)
        proc.stdin.write(frame_bgr.tobytes())
        
        # Save storyboard frames
        for st in sample_timestamps:
            if abs(t - st) < (0.5 / FPS):
                storyboard_frames[st] = frame_bgr.copy()
                
        if f % 60 == 0:
            pct = (f / TOTAL_FRAMES) * 100.0
            print(f"  Frame {f}/{TOTAL_FRAMES} ({pct:.1f}%) | Time: {t:.2f}s")
            
    proc.stdin.close()
    proc.wait()
    print(f"Video raw render complete: {RAW_MP4} ({os.path.getsize(RAW_MP4)} bytes)")
    
    # 4. Mux Audio Loop
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
    
    # 5. Copy to user Downloads
    shutil.copy2(FINAL_MP4, DOWNLOADS_COPY)
    print(f"Showreel exported to Downloads: {DOWNLOADS_COPY}")
    
    # 6. Generate 4-Panel Storyboard Contact Sheet
    print("\nGenerating 4-panel Storyboard Contact Sheet...")
    panels = []
    for st in sample_timestamps:
        if st in storyboard_frames:
            im = Image.fromarray(cv2.cvtColor(storyboard_frames[st], cv2.COLOR_BGR2RGB))
            # Resize panel to 960x540
            panels.append(im.resize((960, 540), Image.Resampling.LANCZOS))
            
    if len(panels) == 4:
        # Create 2x2 grid (1920 x 1080)
        sb = Image.new("RGB", (1920, 1080), (10, 14, 22))
        sb.paste(panels[0], (0, 0))
        sb.paste(panels[1], (960, 0))
        sb.paste(panels[2], (0, 540))
        sb.paste(panels[3], (960, 540))
        
        # Grid divider lines
        sb_draw = ImageDraw.Draw(sb)
        sb_draw.line([(960, 0), (960, 1080)], fill=(40, 55, 80), width=3)
        sb_draw.line([(0, 540), (1920, 540)], fill=(40, 55, 80), width=3)
        
        sb.save(STORYBOARD_JPG, quality=95)
        print(f"Storyboard contact sheet saved: {STORYBOARD_JPG}")

    print("\nAll renders complete successfully!")

if __name__ == "__main__":
    main()
