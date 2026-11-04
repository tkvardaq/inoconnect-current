"""
InoConnect Cinematic Brand Story Film Engine
============================================
A 35.5-second narrative film that acts as:
1. The Main Attention Grabber (The Agency Trap)
2. The Sales Pitch (Autonomous Intelligence + Engineered Pipeline)
3. The Introduction to InoConnect (Unfair Growth Advantage)

Inspired by Ogilvy (editorial storytelling), Impactable (anti-commodity pipeline),
Ignite Visibility (ambient motion & proof), and Spire Agency (brand elevation).

Synced with Google Gemini AI Studio broadcast narration (Puck) + deep urban score.
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
TOTAL_SEC = 35.5
TOTAL_FRAMES = int(TOTAL_SEC * FPS)  # 1065 frames

IMG_DIR = r"d:\ino website\images"
OUT_DIR = r"d:\ino website\videos"
os.makedirs(OUT_DIR, exist_ok=True)

RAW_MP4 = os.path.join(OUT_DIR, "story_raw.mp4")
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
C_DARK = (11, 15, 25)           # Obsidian Dark #0B0F19
C_WHITE = (255, 255, 255)
C_MUTED = (203, 213, 225)       # Slate 300
C_WARN = (239, 68, 68)          # Crimson Red #EF4444

_FONTS = {}
def get_font(size, bold=True):
    key = (size, bold)
    if key not in _FONTS:
        try:
            _FONTS[key] = ImageFont.truetype(FONT_PATH, size)
        except Exception:
            _FONTS[key] = ImageFont.load_default()
    return _FONTS[key]

def load_img(fn):
    p = os.path.join(IMG_DIR, fn)
    if os.path.exists(p):
        return Image.open(p).convert("RGB")
    return Image.new("RGB", (W, H), (15, 23, 42))

IMG_OFFICE = load_img("austin-distel-gUIJ0YszPig-unsplash.jpg")
IMG_MEETING = load_img("austin-distel-744oGeqpxPQ-unsplash.jpg")
IMG_GROWTH_MATRIX = load_img("inoconnect_growth_matrix.png")
IMG_AUTO = load_img("inoconnect_ai_automation_hero.png")
IMG_PPC = load_img("service_ppc_visualization_1766962268848.png")
IMG_SEO = load_img("service_seo_visualization_1766962251094.png")
IMG_WEB = load_img("service_webdev_visualization_1766962366202.png")
IMG_STRATEGY = load_img("inoconnect_strategy_workspace.png")

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

# Top Chapter Progress HUD (Ogilvy/Cinema style)
CHAPTERS = [
    ("I. THE TRAP", 0.0, 8.8),
    ("II. THE SHIFT", 8.8, 15.0),
    ("III. THE ENGINE", 15.0, 25.0),
    ("IV. THE SCALE", 25.0, 35.5)
]

def draw_cinema_hud(draw, t):
    # Sleek, translucent top bar
    bar_w = 780
    bar_h = 42
    bar_x = (W - bar_w) // 2
    bar_y = 28
    
    draw.rounded_rectangle(
        [(bar_x, bar_y), (bar_x + bar_w, bar_y + bar_h)],
        radius=21,
        fill=(11, 15, 25, 220),
        outline=(255, 255, 255, 50),
        width=1
    )
    
    cx = bar_x + 28
    cw = (bar_w - 56) // len(CHAPTERS)
    
    for i, (name, st, et) in enumerate(CHAPTERS):
        is_active = (st <= t < et)
        is_past = (t >= et)
        
        # indicator dot
        dot_col = C_ACCENT if is_active else (C_MINT if is_past else (71, 85, 105))
        draw.ellipse([(cx, bar_y + 16), (cx + 10, bar_y + 26)], fill=dot_col)
        
        f = get_font(14, bold=is_active)
        t_col = C_WHITE if is_active else (C_MUTED if is_past else (100, 116, 139))
        draw.text((cx + 18, bar_y + 11), name, font=f, fill=t_col)
        cx += cw


# Act 1: The Commodity Trap (0.0s – 8.8s / Frames 0 to 264)
def render_act_1(t, f_idx):
    # 0 to 4.5s: Boardroom / Desaturated office
    # 4.5 to 8.8s: Stagnant campaign reports, budget drain
    stage = Image.new("RGB", (W, H), (11, 15, 25))
    
    if t < 4.5:
        # Scene 1A: The Boardroom Stare
        p = t / 4.5
        scale = 1.0 + 0.08 * ease_in_out(p)
        iw, ih = IMG_MEETING.size
        cw = int(iw / scale)
        ch = int(ih / scale)
        cx = (iw - cw) // 2
        cy = (ih - ch) // 2
        cropped = IMG_MEETING.crop((cx, cy, cx + cw, cy + ch))
        base = cropped.resize((W, H), Image.Resampling.LANCZOS)
        
        # Heavy desaturated moody grade with warning red pulse
        dim = Image.new("RGB", (W, H), (11, 15, 25))
        stage = Image.blend(base, dim, 0.70)
        draw = ImageDraw.Draw(stage, "RGBA")
        
        # Dark vignette
        for y in range(0, H):
            if y < 140 or y > H - 200:
                draw.line([(0, y), (W, y)], fill=(11, 15, 25, 200))
                
        # Kinetic Editorial Headline (Ogilvy/Impactable)
        t1 = "MOST AGENCIES SELL ACTIVITY."
        f1 = get_font(72, bold=True)
        b1 = draw.textbbox((0, 0), t1, font=f1)
        w1 = b1[2] - b1[0]
        draw.text(((W - w1)//2, 380), t1, font=f1, fill=C_WHITE)
        
        if p > 0.35:
            # Floating warning pill
            pop = ease_out_cubic(min(1.0, (p - 0.35) / 0.35))
            bw, bh = 640, 52
            bx = (W - bw) // 2
            by = int(480 - 20 * (1.0 - pop))
            draw.rounded_rectangle([(bx, by), (bx + bw, by + bh)], radius=26, fill=(15, 23, 42, 240), outline=C_WARN + (180,), width=2)
            draw.ellipse([(bx + 20, by + 18), (bx + 34, by + 32)], fill=C_WARN)
            draw.text((bx + 44, by + 14), "The Retainer Trap: Billable Hours Without Revenue", font=get_font(18, bold=True), fill=C_WARN)
    else:
        # Scene 1B: The Burning Ad Budget
        p = (t - 4.5) / 4.3
        scale = 1.0 + 0.08 * ease_in_out(p)
        iw, ih = IMG_OFFICE.size
        cw = int(iw / scale)
        ch = int(ih / scale)
        cx = (iw - cw) // 2
        cy = (ih - ch) // 2
        cropped = IMG_OFFICE.crop((cx, cy, cx + cw, cy + ch))
        base = cropped.resize((W, H), Image.Resampling.LANCZOS)
        
        dim = Image.new("RGB", (W, H), (11, 15, 25))
        stage = Image.blend(base, dim, 0.75)
        draw = ImageDraw.Draw(stage, "RGBA")
        
        # Red atmospheric alarm glow
        pulse = 0.5 + 0.5 * math.sin(p * 8.0)
        draw.ellipse([(W//2 - 400, H//2 - 300), (W//2 + 400, H//2 + 300)], fill=(239, 68, 68, int(35 * pulse)))
        
        t1 = "HOURS LOGGED. BUDGETS BURNED."
        f1 = get_font(68, bold=True)
        b1 = draw.textbbox((0, 0), t1, font=f1)
        w1 = b1[2] - b1[0]
        draw.text(((W - w1)//2, 360), t1, font=f1, fill=C_WHITE)
        
        t2 = "VANITY CLICKS DO NOT HIT THE BOTTOM LINE."
        f2 = get_font(38, bold=True)
        b2 = draw.textbbox((0, 0), t2, font=f2)
        w2 = b2[2] - b2[0]
        draw.text(((W - w2)//2, 460), t2, font=f2, fill=C_ACCENT)
        
        # Stat card
        sc_w, sc_h = 560, 60
        sc_x = (W - sc_w) // 2
        sc_y = 540
        draw.rounded_rectangle([(sc_x, sc_y), (sc_x + sc_w, sc_y + sc_h)], radius=30, fill=(30, 41, 59, 230), outline=(255, 255, 255, 60), width=1)
        draw.text((sc_x + 36, sc_y + 18), "76% of Ad Spend Produces Zero Closed Pipeline", font=get_font(20, bold=True), fill=C_MUTED)
        
    draw_s = ImageDraw.Draw(stage, "RGBA")
    draw_cinema_hud(draw_s, t)
    return stage


# Act 2: The Shift (8.8s – 15.0s / Frames 264 to 450)
def render_act_2(t, f_idx):
    p = (t - 8.8) / 6.2
    stage = Image.new("RGB", (W, H), (11, 15, 25))
    
    # 3D InoConnect Growth Matrix zooms in with vibrant colors awakening
    scale = 1.0 + 0.12 * ease_in_out(p)
    iw, ih = IMG_GROWTH_MATRIX.size
    cw = int(iw / scale)
    ch = int(ih / scale)
    cx = (iw - cw) // 2
    cy = (ih - ch) // 2
    cropped = IMG_GROWTH_MATRIX.crop((cx, cy, cx + cw, cy + ch))
    base = cropped.resize((W, H), Image.Resampling.LANCZOS)
    
    dim = Image.new("RGB", (W, H), (11, 15, 25))
    stage = Image.blend(base, dim, 0.50)
    draw = ImageDraw.Draw(stage, "RGBA")
    
    # Luminous cyan & orange light burst from center
    draw.ellipse([(W//2 - 450, H//2 - 350), (W//2 + 450, H//2 + 350)], fill=(65, 105, 225, 45))
    draw.ellipse([(W//2 - 250, H//2 - 200), (W//2 + 250, H//2 + 200)], fill=(255, 117, 24, 35))
    
    # Impactable style manifesto
    t1 = "STOP PAYING AGENCIES TO LEARN ON YOUR DIME."
    f1 = get_font(52, bold=True)
    b1 = draw.textbbox((0, 0), t1, font=f1)
    w1 = b1[2] - b1[0]
    draw.text(((W - w1)//2, 340), t1, font=f1, fill=C_WHITE)
    
    if p > 0.25:
        pop = ease_out_cubic(min(1.0, (p - 0.25) / 0.40))
        t2 = "YOU NEED AN ENGINEERED REVENUE ENGINE."
        f2 = get_font(60, bold=True)
        b2 = draw.textbbox((0, 0), t2, font=f2)
        w2 = b2[2] - b2[0]
        draw.text(((W - w2)//2, 430), t2, font=f2, fill=C_MINT)
        
    if p > 0.55:
        pop3 = ease_out_cubic(min(1.0, (p - 0.55) / 0.35))
        bw, bh = 800, 60
        bx = (W - bw) // 2
        by = int(530 - 20 * (1.0 - pop3))
        draw.rounded_rectangle([(bx, by), (bx + bw, by + bh)], radius=30, fill=(15, 23, 42, 245), outline=C_ACCENT + (220,), width=2)
        draw.text((bx + 40, by + 18), "Autonomous Execution  •  Unified Attribution  •  Compounding ROAS", font=get_font(20, bold=True), fill=C_WHITE)
        
    draw_s = ImageDraw.Draw(stage, "RGBA")
    draw_cinema_hud(draw_s, t)
    return stage


# Act 3: The Engine in Action (15.0s – 25.0s / Frames 450 to 750)
def render_act_3(t, f_idx):
    p = (t - 15.0) / 10.0
    stage = Image.new("RGB", (W, H), (11, 15, 25))
    
    # 3 mini chapters:
    # 15.0 to 18.5s: AI Automation pipeline (IMG_AUTO)
    # 18.5 to 21.8s: Scaled Paid & Search (IMG_PPC & IMG_SEO)
    # 21.8 to 25.0s: Lightspeed Web Architecture (IMG_WEB)
    
    if t < 18.5:
        # 3A: Autonomous AI Pipeline
        sub_p = (t - 15.0) / 3.5
        scale = 1.0 + 0.08 * ease_in_out(sub_p)
        iw, ih = IMG_AUTO.size
        cw = int(iw / scale)
        ch = int(ih / scale)
        cropped = IMG_AUTO.crop(((iw - cw)//2, (ih - ch)//2, (iw + cw)//2, (ih + ch)//2))
        base = cropped.resize((W, H), Image.Resampling.LANCZOS)
        dim = Image.new("RGB", (W, H), (11, 15, 25))
        stage = Image.blend(base, dim, 0.45)
        draw = ImageDraw.Draw(stage, "RGBA")
        
        # Pipeline Flow Card
        card_w, card_h = 1000, 200
        card_x = (W - card_w) // 2
        card_y = 130
        draw.rounded_rectangle([(card_x, card_y), (card_x + card_w, card_y + card_h)], radius=22, fill=(11, 15, 25, 245), outline=C_CYAN + (220,), width=2)
        draw.text((card_x + 36, card_y + 20), "24/7 AUTONOMOUS REVENUE AGENT PIPELINE", font=get_font(18, bold=True), fill=C_CYAN)
        draw.text((card_x + card_w - 240, card_y + 20), "⚡ Latency: 0.8s  •  Active", font=get_font(16, bold=True), fill=C_MINT)
        
        # 3 nodes
        nodes = [("1. INBOUND LEAD", "WhatsApp / Web", C_PRIMARY), ("2. AI INTENT PARSER", "Qualifies in 0.8s", C_CYAN), ("3. CALENDAR DISPATCH", "Instant CRM Sync", C_MINT)]
        nw = 270
        for ni, (nt, ns, nc) in enumerate(nodes):
            nx = card_x + 35 + ni * (nw + 60)
            ny = card_y + 60
            draw.rounded_rectangle([(nx, ny), (nx + nw, ny + 110)], radius=16, fill=(15, 23, 42, 245), outline=nc + (180,), width=2)
            draw.text((nx + 18, ny + 24), nt, font=get_font(17, bold=True), fill=C_WHITE)
            draw.text((nx + 18, ny + 64), ns, font=get_font(15, bold=False), fill=nc)
            if ni < 2:
                # connecting arrow + energy pulse
                x1 = nx + nw
                x2 = nx + nw + 60
                draw.line([(x1, ny + 55), (x2, ny + 55)], fill=(100, 116, 139), width=3)
                px = int(x1 + (x2 - x1) * ((sub_p * 3.0) % 1.0))
                draw.ellipse([(px - 6, ny + 49), (px + 6, ny + 61)], fill=C_CYAN)
                
        # Lower Badge
        draw.rounded_rectangle([(W//2 - 500, H - 190), (W//2 + 500, H - 80)], radius=24, fill=(11, 15, 25, 245), outline=C_CYAN + (200,), width=2)
        draw.text((W//2 - 460, H - 170), "Autonomous AI Lead Qualification & 24/7 Ops", font=get_font(32, bold=True), fill=C_WHITE)
        draw.text((W//2 - 460, H - 124), "Zero human lag • Instant buyer engagement • Automated pipeline enrichment", font=get_font(18, bold=False), fill=C_MUTED)

    elif t < 21.8:
        # 3B: Performance PPC & Organic SEO
        sub_p = (t - 18.5) / 3.3
        scale = 1.0 + 0.08 * ease_in_out(sub_p)
        # Combine 3D PPC and SEO
        stage = Image.new("RGB", (W, H), (11, 15, 25))
        # Place PPC on right, SEO on left
        ppc_res = IMG_PPC.resize((800, 800), Image.Resampling.LANCZOS)
        stage.paste(ppc_res, (W - 820, (H - 800)//2))
        
        dim = Image.new("RGB", (W, H), (11, 15, 25))
        stage = Image.blend(stage, dim, 0.40)
        draw = ImageDraw.Draw(stage, "RGBA")
        
        # Live HUD Card on Left
        ch_w, ch_h = 680, 320
        ch_x = 90
        ch_y = 140
        draw.rounded_rectangle([(ch_x, ch_y), (ch_x + ch_w, ch_y + ch_h)], radius=22, fill=(11, 15, 25, 245), outline=C_ACCENT + (220,), width=2)
        draw.ellipse([(ch_x + 30, ch_y + 26), (ch_x + 44, ch_y + 40)], fill=C_MINT)
        draw.text((ch_x + 55, ch_y + 22), "HIGH-INTENT MULTI-CHANNEL SCALING", font=get_font(16, bold=True), fill=C_ACCENT)
        
        draw.text((ch_x + 30, ch_y + 65), "4.8x ROAS", font=get_font(64, bold=True), fill=C_WHITE)
        draw.text((ch_x + 330, ch_y + 90), "+340% Conversions", font=get_font(22, bold=True), fill=C_MINT)
        
        draw.rounded_rectangle([(ch_x + 30, ch_y + 160), (ch_x + ch_w - 30, ch_y + 220)], radius=14, fill=(30, 41, 59, 240))
        draw.text((ch_x + 45, ch_y + 175), "★ #1 Google Organic Rank  •  Google Ads Premier  •  Meta Certified", font=get_font(17, bold=True), fill=C_WHITE)
        
        draw.rounded_rectangle([(ch_x + 30, ch_y + 240), (ch_x + ch_w - 30, ch_y + 295)], radius=14, fill=(15, 23, 42, 240), outline=C_MINT + (140,), width=1)
        draw.text((ch_x + 45, ch_y + 256), "Verified Acquisition Math  •  Zero Retainer Guesswork", font=get_font(17, bold=True), fill=C_MINT)
        
        # Lower Badge
        draw.rounded_rectangle([(W//2 - 500, H - 190), (W//2 + 500, H - 80)], radius=24, fill=(11, 15, 25, 245), outline=C_ACCENT + (200,), width=2)
        draw.text((W//2 - 460, H - 170), "Precision Performance Advertising & SEO Dominance", font=get_font(32, bold=True), fill=C_WHITE)
        draw.text((W//2 - 460, H - 124), "Compounding organic authority combined with surgical paid acquisition", font=get_font(18, bold=False), fill=C_MUTED)

    else:
        # 3C: Lightspeed Web & CRO Architecture
        sub_p = (t - 21.8) / 3.2
        scale = 1.0 + 0.08 * ease_in_out(sub_p)
        web_res = IMG_WEB.resize((840, 840), Image.Resampling.LANCZOS)
        stage = Image.new("RGB", (W, H), (11, 15, 25))
        stage.paste(web_res, (W - 860, (H - 840)//2))
        
        dim = Image.new("RGB", (W, H), (11, 15, 25))
        stage = Image.blend(stage, dim, 0.40)
        draw = ImageDraw.Draw(stage, "RGBA")
        
        # 100/100 PageSpeed Gauge Card
        ch_w, ch_h = 640, 320
        ch_x = 90
        ch_y = 140
        draw.rounded_rectangle([(ch_x, ch_y), (ch_x + ch_w, ch_y + ch_h)], radius=22, fill=(11, 15, 25, 245), outline=C_MINT + (220,), width=2)
        draw.text((ch_x + 30, ch_y + 24), "GOOGLE LIGHTHOUSE 100 PERFORMANCE", font=get_font(17, bold=True), fill=C_MINT)
        
        # Dial
        dcx, dcy = ch_x + 110, ch_y + 140
        rad = 65
        draw.ellipse([(dcx - rad, dcy - rad), (dcx + rad, dcy + rad)], outline=(30, 41, 59), width=10)
        draw.arc([(dcx - rad, dcy - rad), (dcx + rad, dcy + rad)], start=-90, end=270, fill=C_MINT, width=10)
        draw.text((dcx - 48, dcy - 36), "100", font=get_font(52, bold=True), fill=C_WHITE)
        
        metrics = [("Global TTFB", "0.24s", C_CYAN), ("LCP Load Time", "0.41s", C_MINT), ("Conversion Lift", "+64.2%", C_ACCENT)]
        my = ch_y + 80
        for l, v, c in metrics:
            draw.text((ch_x + 230, my), l, font=get_font(18, bold=False), fill=C_MUTED)
            draw.text((ch_x + 460, my), v, font=get_font(20, bold=True), fill=c)
            my += 40
            
        draw.rounded_rectangle([(ch_x + 30, ch_y + 245), (ch_x + ch_w - 30, ch_y + 295)], radius=12, fill=(30, 41, 59, 220))
        draw.text((ch_x + 45, ch_y + 258), "Astro & Next.js Architecture  •  Engineered to Convert", font=get_font(16, bold=True), fill=C_WHITE)
        
        # Lower Badge
        draw.rounded_rectangle([(W//2 - 500, H - 190), (W//2 + 500, H - 80)], radius=24, fill=(11, 15, 25, 245), outline=C_MINT + (200,), width=2)
        draw.text((W//2 - 460, H - 170), "High-Performance Digital Infrastructure & CRO", font=get_font(32, bold=True), fill=C_WHITE)
        draw.text((W//2 - 460, H - 124), "Lightning-fast platforms built to eliminate drop-off and maximize buyer conversion", font=get_font(18, bold=False), fill=C_MUTED)

    draw_s = ImageDraw.Draw(stage, "RGBA")
    draw_cinema_hud(draw_s, t)
    return stage


# Act 4: The Scale & Climax (25.0s – 35.5s / Frames 750 to 1065)
def render_act_4(t, f_idx):
    p = (t - 25.0) / 10.5
    stage = Image.new("RGB", (W, H), (11, 15, 25))
    
    if t < 29.5:
        # 4A: Attribution & Mathematical Scale
        sub_p = (t - 25.0) / 4.5
        scale = 1.0 + 0.06 * ease_in_out(sub_p)
        iw, ih = IMG_STRATEGY.size
        cw = int(iw / scale)
        ch = int(ih / scale)
        cropped = IMG_STRATEGY.crop(((iw - cw)//2, (ih - ch)//2, (iw + cw)//2, (ih + ch)//2))
        base = cropped.resize((W, H), Image.Resampling.LANCZOS)
        dim = Image.new("RGB", (W, H), (11, 15, 25))
        stage = Image.blend(base, dim, 0.40)
        draw = ImageDraw.Draw(stage, "RGBA")
        
        # Attribution Dashboard Card
        card_w, card_h = 820, 280
        card_x = (W - card_w) // 2
        card_y = 140
        draw.rounded_rectangle([(card_x, card_y), (card_x + card_w, card_y + card_h)], radius=24, fill=(11, 15, 25, 245), outline=C_PRIMARY + (220,), width=2)
        draw.text((card_x + 36, card_y + 22), "UNIFIED ATTRIBUTION & PREDICTABLE REVENUE", font=get_font(18, bold=True), fill=C_PRIMARY)
        
        stages = [("1. AWARENESS", "100K Intent", C_MUTED), ("2. PIPELINE", "24K Qualified", C_CYAN), ("3. CLOSED WON", "$38M+ Attributed", C_MINT)]
        sw = 230
        for si, (st, ss, sc) in enumerate(stages):
            sx = card_x + 36 + si * (sw + 25)
            sy = card_y + 70
            draw.rounded_rectangle([(sx, sy), (sx + sw, sy + 75)], radius=14, fill=(15, 23, 42, 245), outline=sc + (140,), width=1)
            draw.text((sx + 16, sy + 14), st, font=get_font(15, bold=True), fill=C_WHITE)
            draw.text((sx + 16, sy + 42), ss, font=get_font(17, bold=True), fill=sc)
            
        draw.rounded_rectangle([(card_x + 36, card_y + 175), (card_x + card_w - 36, card_y + 245)], radius=16, fill=(30, 41, 59, 230))
        draw.text((card_x + 50, card_y + 195), "5.2x LTV:CAC Ratio  •  Full Data Sovereignty  •  Zero Fluff", font=get_font(20, bold=True), fill=C_MINT)
        
        # Lower Badge
        draw.rounded_rectangle([(W//2 - 500, H - 190), (W//2 + 500, H - 80)], radius=24, fill=(11, 15, 25, 245), outline=C_PRIMARY + (200,), width=2)
        draw.text((W//2 - 460, H - 170), "Mathematically Predictable Commercial Scaling", font=get_font(32, bold=True), fill=C_WHITE)
        draw.text((W//2 - 460, H - 124), "Transform marketing from an uncertain cost center into an engineered profit engine", font=get_font(18, bold=False), fill=C_MUTED)

    else:
        # 4B: Climax Brand Crest & Call to Action
        sub_p = (t - 29.5) / 6.0
        scale = 1.0 + 0.05 * ease_in_out(sub_p)
        iw, ih = IMG_GROWTH_MATRIX.size
        cw = int(iw / scale)
        ch = int(ih / scale)
        cropped = IMG_GROWTH_MATRIX.crop(((iw - cw)//2, (ih - ch)//2, (iw + cw)//2, (ih + ch)//2))
        base = cropped.resize((W, H), Image.Resampling.LANCZOS)
        dim = Image.new("RGB", (W, H), (11, 15, 25))
        stage = Image.blend(base, dim, 0.72)
        draw = ImageDraw.Draw(stage, "RGBA")
        
        # Logo in Center
        if LOGO_IMG:
            lw = 280
            lh = int(lw * LOGO_IMG.height / LOGO_IMG.width)
            logo_res = LOGO_IMG.resize((lw, lh), Image.Resampling.LANCZOS)
            stage = stage.convert("RGBA")
            stage.alpha_composite(logo_res, ((W - lw) // 2, 210))
            stage = stage.convert("RGB")
            draw = ImageDraw.Draw(stage, "RGBA")
            
        draw.text(((W - 320)//2, 360), "InoConnect", font=get_font(56, bold=True), fill=C_WHITE)
        
        t_call = "WE DON'T MANAGE CAMPAIGNS. WE ENGINEER PIPELINE."
        b_c = draw.textbbox((0, 0), t_call, font=get_font(36, bold=True))
        cw = b_c[2] - b_c[0]
        draw.text(((W - cw)//2, 450), t_call, font=get_font(36, bold=True), fill=C_MINT)
        
        t_sub = "Direct-Response Creative  •  Autonomous AI  •  Compounding Revenue"
        b_s = draw.textbbox((0, 0), t_sub, font=get_font(21, bold=False))
        sw = b_s[2] - b_s[0]
        draw.text(((W - sw)//2, 510), t_sub, font=get_font(21, bold=False), fill=C_MUTED)
        
        # High-Converting CTA Button
        btn_w, btn_h = 560, 72
        btn_x = (W - btn_w) // 2
        btn_y = 590
        pulse = 0.5 + 0.5 * math.sin(sub_p * 8.0)
        draw.rounded_rectangle([(btn_x - 3, btn_y - 3), (btn_x + btn_w + 3, btn_y + btn_h + 3)], radius=36, fill=C_ACCENT + (int(100 * pulse),))
        draw.rounded_rectangle([(btn_x, btn_y), (btn_x + btn_w, btn_y + btn_h)], radius=35, fill=C_ACCENT + (255,))
        
        c_text = "CLAIM YOUR STRATEGIC GROWTH AUDIT →"
        b_t = draw.textbbox((0, 0), c_text, font=get_font(21, bold=True))
        tw = b_t[2] - b_t[0]
        draw.text(((W - tw)//2, btn_y + 24), c_text, font=get_font(21, bold=True), fill=C_WHITE)
        
        url_text = "inoconnect.com  •  Clutch 4.9/5  •  Google Premier Partner"
        b_u = draw.textbbox((0, 0), url_text, font=get_font(18, bold=True))
        uw = b_u[2] - b_u[0]
        draw.text(((W - uw)//2, 695), url_text, font=get_font(18, bold=True), fill=C_MUTED)

    draw_s = ImageDraw.Draw(stage, "RGBA")
    draw_cinema_hud(draw_s, t)
    return stage


def generate_frame(f_idx):
    t = f_idx / FPS
    if t < 8.8:
        return render_act_1(t, f_idx)
    elif t < 15.0:
        return render_act_2(t, f_idx)
    elif t < 25.0:
        return render_act_3(t, f_idx)
    else:
        return render_act_4(t, f_idx)


def main():
    print(f"=== Rendering InoConnect Cinematic Story Film ===")
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
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        RAW_MP4
    ]
    
    pipe = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE)
    
    # Store 10 key storyboard frames
    checkpoints = [
        int(2.0 * FPS),   # Act 1A
        int(6.5 * FPS),   # Act 1B
        int(10.5 * FPS),  # Act 2A
        int(13.5 * FPS),  # Act 2B
        int(16.5 * FPS),  # Act 3A (AI)
        int(20.0 * FPS),  # Act 3B (PPC/SEO)
        int(23.5 * FPS),  # Act 3C (Web/CRO)
        int(27.0 * FPS),  # Act 4A (Attribution)
        int(31.5 * FPS),  # Act 4B (Logo)
        int(34.5 * FPS),  # Act 4B (CTA)
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
    print("Video encoding complete.")
    
    # Generate 16:9 Storyboard Sheet (5 cols x 2 rows)
    print("Generating High-Res Storyboard Sheet...")
    sheet_w, sheet_h = 1920, 1080
    sheet = Image.new("RGB", (sheet_w, sheet_h), (11, 15, 25))
    draw_s = ImageDraw.Draw(sheet)
    
    cols = 5
    rows = 2
    tw, th = 360, 202
    gap_x = 20
    gap_y = 52
    start_x = (sheet_w - (cols * tw + (cols - 1) * gap_x)) // 2
    start_y = 100
    
    titles = [
        "1. THE TRAP: ACTIVITY VS GROWTH",
        "2. BURNED BUDGETS & VANITY METRICS",
        "3. THE TURNING POINT: STOP LEARNING",
        "4. THE REVENUE ENGINE MANIFESTO",
        "5. 24/7 AUTONOMOUS AI PIPELINE",
        "6. SCALED PAID & SEARCH DOMINANCE",
        "7. 100/100 SPEED & CRO CONVERSION",
        "8. UNIFIED ATTRIBUTION & 5.2x LTV:CAC",
        "9. INOCONNECT BRAND CREST",
        "10. CLAIM YOUR GROWTH AUDIT"
    ]
    
    draw_s.text((start_x, 35), "INOCONNECT — THE CINEMATIC STORY FILM (35.5s)", font=get_font(28, bold=True), fill=C_WHITE)
    draw_s.text((sheet_w - start_x - 420, 42), "GOOGLE GEMINI NARRATION • 1080P", font=get_font(18, bold=True), fill=C_MINT)
    
    for idx, f in enumerate(contact_frames[:10]):
        thumb = f.resize((tw, th), Image.Resampling.LANCZOS)
        r = idx // cols
        c = idx % cols
        x = start_x + c * (tw + gap_x)
        y = start_y + r * (th + gap_y)
        sheet.paste(thumb, (x, y))
        draw_s.text((x, y - 24), titles[idx], font=get_font(13, bold=True), fill=C_ACCENT)
        draw_s.rectangle([(x - 1, y - 1), (x + tw, y + th)], outline=(255, 255, 255, 60), width=1)
        
    sheet.save(STORYBOARD_JPG, quality=94)
    print(f"Saved Storyboard to: {STORYBOARD_JPG}")
    
    # Mux with mastered audio
    print("Muxing video with mastered Gemini voiceover + score...")
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
        
    print("=== Story Film Pipeline Finished Successfully! ===")

if __name__ == "__main__":
    main()
