"""
InoConnect Disruptive Agency Showreel Engine (V2 - Ultra Polish)
================================================================
100% Relatable Service Visuals • Disruptive Advertising Style
- Real 16:9 framing for all assets
- Authentic marketing dashboards, live Google search, PageSpeed 100 dial, AI node graph
- Kinetic typography with real agency workspace footage for Hook & Endcard
- High-contrast, crystal-clear typography matching InoConnect website
- 1920x1080 30FPS, AAC Stereo mastered soundtrack
"""

import os
import sys
import glob
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
HOOK_FRAMES = 75   # 2.5s
SCENE_FRAMES = 84  # 2.8s each for 8 services
END_FRAMES = 90    # 3.0s
TOTAL_FRAMES = HOOK_FRAMES + 8 * SCENE_FRAMES + END_FRAMES # 837 frames (~27.9s)

IMG_DIR = r"d:\ino website\images"
OUT_DIR = r"d:\ino website\videos"
os.makedirs(OUT_DIR, exist_ok=True)

RAW_MP4 = os.path.join(OUT_DIR, "disruptive_raw.mp4")
FINAL_MP4 = os.path.join(OUT_DIR, "inoconnect-hero-showreel.mp4")
DOWNLOADS_COPY = r"C:\Users\talha\Downloads\InoConnect_Hero_Showreel.mp4"
STORYBOARD_JPG = os.path.join(OUT_DIR, "inoconnect_hero_storyboard.jpg")
LOGO_PATH = r"d:\ino website\logo.png"
FONT_PATH = r"D:\videos for reels\fonts\Outfit-Variable.ttf"
AUDIO_IN = r"D:\videos for reels\stock\music_623_deep_urban_house.mp3"
MASTERED_WAV = os.path.join(OUT_DIR, "disruptive_audio_mastered.wav")

# Brand Colors from InoConnect
C_PRIMARY = (65, 105, 225)      # Royal Blue #4169E1
C_ACCENT = (255, 117, 24)       # Electric Orange #FF7518
C_MINT = (68, 215, 168)         # Neon Mint #44D7A8
C_CYAN = (0, 210, 255)          # Cyber Cyan #00D2FF
C_DARK = (11, 15, 25)           # Obsidian #0B0F19
C_WHITE = (255, 255, 255)
C_MUTED = (203, 213, 225)       # Slate 300 (high readability)

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
    print(f"Warning: {fn} not found")
    return Image.new("RGB", (W, H), (15, 23, 42))

IMG_PPC = load_img("service_ppc_visualization_1766962268848.png")
IMG_SEO = load_img("service_seo_visualization_1766962251094.png")
IMG_AUTO = load_img("inoconnect_ai_automation_hero.png")
IMG_AIDEV = load_img("inoconnect_ai_dev_hero.png")
IMG_WEB = load_img("service_webdev_visualization_1766962366202.png")
IMG_CONTENT = load_img("service_content_visualization_1766962324454.png")
IMG_SOCIAL = load_img("service_social_visualization_1766962344230.png")
IMG_STRATEGY = load_img("inoconnect_strategy_workspace.png")
IMG_GROWTH = load_img("inoconnect_growth_matrix.png")
IMG_OFFICE = load_img("austin-distel-gUIJ0YszPig-unsplash.jpg")

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

# Composite 16:9 background with proper aspect ratio handling
def render_16_9_stage(img, progress, side="right"):
    """
    Creates a cinematic 16:9 composition:
    - If img is square (1024x1024), we place it on the 'side' with 3D scale & glow,
      and keep the opposite side clean for the live UI simulation card.
    - If img is already 16:9, we pan/zoom smoothly.
    """
    scale = 1.0 + 0.08 * ease_in_out(progress)
    iw, ih = img.size
    stage = Image.new("RGB", (W, H), (11, 15, 25))
    
    if abs(iw / ih - 16 / 9) < 0.2:
        # Native widescreen: crop and zoom
        cw = int(iw / scale)
        ch = int(ih / scale)
        cx = (iw - cw) // 2
        cy = (ih - ch) // 2
        cropped = img.crop((cx, cy, cx + cw, cy + ch))
        stage = cropped.resize((W, H), Image.Resampling.LANCZOS)
    else:
        # Square asset: blurred ambient background + sharp hero asset placed on specified side
        blur_bg = img.resize((W, H), Image.Resampling.BILINEAR)
        blur_bg = blur_bg.filter(ImageFilter.GaussianBlur(radius=30))
        # Dim blurred bg
        dim = Image.new("RGB", (W, H), (11, 15, 25))
        stage = Image.blend(blur_bg, dim, 0.65)
        
        # Place sharp asset on designated side
        asset_size = int(880 * scale)
        asset_res = img.resize((asset_size, asset_size), Image.Resampling.LANCZOS)
        
        if side == "right":
            ax = W - asset_size - 60
        elif side == "center":
            ax = (W - asset_size) // 2
        else:
            ax = 60
        ay = (H - asset_size) // 2 - 20
        stage.paste(asset_res, (ax, ay))
        
    # Apply atmospheric dark gradient overlays (top for stepper, bottom for lower-third)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    
    # Top bar gradient
    for y in range(0, 110):
        alpha = int(220 * (1.0 - y / 110.0))
        d.line([(0, y), (W, y)], fill=(11, 15, 25, alpha))
        
    # Bottom HUD gradient backing
    for y in range(H - 260, H):
        alpha = int(240 * ((y - (H - 260)) / 260.0))
        d.line([(0, y), (W, y)], fill=(11, 15, 25, alpha))
        
    stage = stage.convert("RGBA")
    stage.alpha_composite(overlay)
    return stage.convert("RGB")

# Top Stepper Navigation Bar
SERVICES_NAV = [
    ("PPC", C_ACCENT),
    ("SEO", C_MINT),
    ("AI AUTO", C_CYAN),
    ("AI DEV", C_PRIMARY),
    ("WEB DEV", C_ACCENT),
    ("CREATIVE", C_MINT),
    ("SOCIAL", C_CYAN),
    ("STRATEGY", C_PRIMARY),
]

def draw_top_stepper(draw, active_idx):
    total_items = len(SERVICES_NAV)
    item_w = 112
    total_w = total_items * item_w + (total_items - 1) * 8 + 48
    start_x = (W - total_w) // 2
    y = 26
    h = 44
    
    # Outer dark glass capsule
    draw.rounded_rectangle(
        [(start_x, y), (start_x + total_w, y + h)],
        radius=22,
        fill=(11, 15, 25, 240),
        outline=(255, 255, 255, 60),
        width=1
    )
    
    # InoConnect orange brand beacon
    draw.ellipse([(start_x + 16, y + 15), (start_x + 30, y + 29)], fill=C_ACCENT)
    
    cur_x = start_x + 42
    for i, (name, color) in enumerate(SERVICES_NAV):
        is_active = (i == active_idx)
        pw = item_w
        if is_active:
            draw.rounded_rectangle(
                [(cur_x, y + 5), (cur_x + pw, y + h - 5)],
                radius=17,
                fill=color + (240,),
                outline=(255, 255, 255, 220),
                width=1
            )
            f = get_font(16, bold=True)
            text_col = (11, 15, 25)
        else:
            f = get_font(15, bold=False)
            text_col = (148, 163, 184)
            
        bbox = draw.textbbox((0, 0), name, font=f)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        tx = cur_x + (pw - tw) // 2
        ty = y + (h - th) // 2 - 2
        draw.text((tx, ty), name, font=f, fill=text_col)
        cur_x += pw + 8


# Lower-Third Service Badge (Matches InoConnect website design & typography)
def draw_service_hero_badge(canvas, title, sub, bullets, color):
    draw = ImageDraw.Draw(canvas, "RGBA")
    
    card_w = 1180
    card_h = 175
    card_x = (W - card_w) // 2
    card_y = H - card_h - 32
    
    # High-contrast glass capsule
    draw.rounded_rectangle(
        [(card_x, card_y), (card_x + card_w, card_y + card_h)],
        radius=26,
        fill=(11, 15, 25, 245),
        outline=color + (220,),
        width=2
    )
    
    # Top neon indicator line
    draw.line([(card_x + 36, card_y + 2), (card_x + card_w - 36, card_y + 2)], fill=color + (255,), width=3)
    
    # Title & Sub
    draw.text((card_x + 40, card_y + 24), title, font=get_font(36, bold=True), fill=C_WHITE)
    draw.text((card_x + 40, card_y + 76), sub, font=get_font(20, bold=False), fill=C_MUTED)
    
    # Checkmark bullets on bottom row
    bx = card_x + 40
    by = card_y + 120
    for bullet in bullets:
        # Mint circle checkmark
        draw.ellipse([(bx, by), (bx + 20, by + 20)], fill=C_MINT)
        draw.line([(bx + 5, by + 10), (bx + 9, by + 15)], fill=(11, 15, 25), width=2)
        draw.line([(bx + 9, by + 15), (bx + 16, by + 5)], fill=(11, 15, 25), width=2)
        
        draw.text((bx + 28, by - 2), bullet, font=get_font(17, bold=True), fill=C_WHITE)
        bbox = draw.textbbox((0, 0), bullet, font=get_font(17, bold=True))
        bx += (bbox[2] - bbox[0]) + 45


# UI Simulation 1: PPC & Paid Acquisition Live Ads Manager
def draw_live_ppc_hud(canvas, progress):
    draw = ImageDraw.Draw(canvas, "RGBA")
    
    card_w, card_h = 620, 350
    card_x = 90
    card_y = 150
    
    pop = ease_out_cubic(min(1.0, progress * 2.2))
    cur_x = int(card_x - 60 * (1.0 - pop))
    
    draw.rounded_rectangle(
        [(cur_x, card_y), (cur_x + card_w, card_y + card_h)],
        radius=24,
        fill=(11, 15, 25, 245),
        outline=C_ACCENT + (220,),
        width=2
    )
    
    # Status Header
    draw.ellipse([(cur_x + 30, card_y + 28), (cur_x + 44, card_y + 42)], fill=C_MINT)
    draw.text((cur_x + 55, card_y + 24), "LIVE GOOGLE & META PERFORMANCE ADS", font=get_font(16, bold=True), fill=C_ACCENT)
    
    # ROAS Counter
    cur_roas = 1.4 + (4.8 - 1.4) * ease_out_cubic(progress)
    draw.text((cur_x + 30, card_y + 68), f"{cur_roas:.1f}x", font=get_font(72, bold=True), fill=C_WHITE)
    draw.text((cur_x + 220, card_y + 96), "SCALED ROAS", font=get_font(22, bold=True), fill=C_MINT)
    
    # Sparkline chart
    chart_x = cur_x + 30
    chart_y = card_y + 165
    chart_w = card_w - 60
    chart_h = 75
    
    points = [0.15, 0.25, 0.35, 0.30, 0.55, 0.70, 0.65, 0.95]
    chart_pts = []
    num_pts = int(len(points) * min(1.0, progress * 1.4)) + 1
    num_pts = min(num_pts, len(points))
    
    for i in range(num_pts):
        px = chart_x + int(i * (chart_w / (len(points) - 1)))
        py = chart_y + chart_h - int(points[i] * chart_h)
        chart_pts.append((px, py))
        
    if len(chart_pts) > 1:
        for i in range(len(chart_pts) - 1):
            draw.line([chart_pts[i], chart_pts[i+1]], fill=C_MINT, width=4)
        draw.ellipse([(chart_pts[-1][0] - 6, chart_pts[-1][1] - 6), (chart_pts[-1][0] + 6, chart_pts[-1][1] + 6)], fill=C_WHITE)

    # Metric pills
    draw.rounded_rectangle([(cur_x + 30, card_y + 265), (cur_x + 290, card_y + 315)], radius=14, fill=(30, 41, 59, 240), outline=C_MINT + (120,), width=1)
    draw.text((cur_x + 48, card_y + 278), "Conversions: +340%", font=get_font(17, bold=True), fill=C_MINT)
    
    draw.rounded_rectangle([(cur_x + 310, card_y + 265), (cur_x + 590, card_y + 315)], radius=14, fill=(30, 41, 59, 240), outline=C_ACCENT + (120,), width=1)
    draw.text((cur_x + 330, card_y + 278), "CPA Drop: -42.8%", font=get_font(17, bold=True), fill=C_ACCENT)


# UI Simulation 2: SEO Google Search Bar & #1 Ranking
def draw_google_search_sim(canvas, progress):
    draw = ImageDraw.Draw(canvas, "RGBA")
    
    sb_w, sb_h = 760, 68
    sb_x = 90
    sb_y = 140
    
    pop = ease_out_cubic(min(1.0, progress * 2.5))
    cur_y = int(sb_y - 30 * (1.0 - pop))
    
    # Google Search bar
    draw.rounded_rectangle(
        [(sb_x, cur_y), (sb_x + sb_w, cur_y + sb_h)],
        radius=34,
        fill=(255, 255, 255, 250),
        outline=C_PRIMARY + (180,),
        width=2
    )
    
    draw.text((sb_x + 28, cur_y + 18), "🔍", font=get_font(22, bold=True), fill=(100, 116, 139))
    
    full_query = "enterprise b2b growth agency"
    type_prog = max(0.0, min(1.0, (progress - 0.1) / 0.5))
    chars_to_show = int(len(full_query) * type_prog)
    typed = full_query[:chars_to_show]
    
    draw.text((sb_x + 75, cur_y + 18), typed, font=get_font(24, bold=True), fill=(15, 23, 42))
    
    # Blinking cursor
    if int(progress * 15) % 2 == 0 and type_prog < 1.0:
        bbox = draw.textbbox((0, 0), typed, font=get_font(24, bold=True))
        tw = bbox[2] - bbox[0]
        draw.line([(sb_x + 78 + tw, cur_y + 16), (sb_x + 78 + tw, cur_y + 50)], fill=(65, 105, 225), width=3)
        
    # #1 Ranking Card drops down
    if progress > 0.50:
        pop_c = ease_out_cubic(min(1.0, (progress - 0.50) / 0.35))
        rc_w, rc_h = 760, 140
        rc_x = sb_x
        rc_y = int(cur_y + sb_h + 16 - 25 * (1.0 - pop_c))
        
        draw.rounded_rectangle(
            [(rc_x, rc_y), (rc_x + rc_w, rc_y + rc_h)],
            radius=20,
            fill=(11, 15, 25, 245),
            outline=C_MINT + (220,),
            width=2
        )
        
        # #1 Rank pill
        draw.rounded_rectangle([(rc_x + 24, rc_y + 22), (rc_x + 140, rc_y + 56)], radius=16, fill=C_MINT + (240,))
        draw.text((rc_x + 36, rc_y + 26), "★ #1 RANK", font=get_font(15, bold=True), fill=(11, 15, 25))
        
        draw.text((rc_x + 155, rc_y + 22), "InoConnect | High Growth Digital Marketing Agency", font=get_font(22, bold=True), fill=C_WHITE)
        draw.text((rc_x + 24, rc_y + 68), "https://inoconnect.com  •  AI Overview Featured Result", font=get_font(16, bold=False), fill=C_MUTED)
        draw.text((rc_x + 24, rc_y + 98), "Organic Traffic: +520% Growth  •  Top Keyword Dominance  •  Zero Ad Waste", font=get_font(16, bold=True), fill=C_MINT)


# UI Simulation 3: AI Automation 24/7 Agent Routing Node Pipeline
def draw_ai_automation_sim(canvas, progress):
    draw = ImageDraw.Draw(canvas, "RGBA")
    
    card_w, card_h = 1040, 240
    card_x = (W - card_w) // 2
    card_y = 140
    
    draw.rounded_rectangle(
        [(card_x, card_y), (card_x + card_w, card_y + card_h)],
        radius=24,
        fill=(11, 15, 25, 245),
        outline=C_CYAN + (220,),
        width=2
    )
    
    draw.text((card_x + 36, card_y + 22), "24/7 AUTONOMOUS REVENUE AGENT PIPELINE", font=get_font(18, bold=True), fill=C_CYAN)
    draw.text((card_x + card_w - 260, card_y + 22), "⚡ Latency: 0.8s  •  Active", font=get_font(16, bold=True), fill=C_MINT)
    
    nodes = [
        ("INBOUND LEAD", "WhatsApp / Web Form", C_PRIMARY),
        ("AI INTENT AGENT", "Instant Parsing & Qual", C_CYAN),
        ("CRM DISPATCH", "Auto-Book & Pipeline Sync", C_MINT)
    ]
    
    node_w = 280
    gap = 70
    start_nx = card_x + 35
    ny = card_y + 65
    
    centers = []
    for i, (ntitle, nsub, col) in enumerate(nodes):
        nx = start_nx + i * (node_w + gap)
        draw.rounded_rectangle(
            [(nx, ny), (nx + node_w, ny + 120)],
            radius=18,
            fill=(15, 23, 42, 245),
            outline=col + (200,),
            width=2
        )
        draw.text((nx + 20, ny + 26), ntitle, font=get_font(19, bold=True), fill=C_WHITE)
        draw.text((nx + 20, ny + 68), nsub, font=get_font(15, bold=False), fill=col)
        centers.append((nx + node_w // 2, ny + 60))
        
    for i in range(len(centers) - 1):
        x1 = start_nx + i * (node_w + gap) + node_w
        x2 = start_nx + (i + 1) * (node_w + gap)
        cy = ny + 60
        draw.line([(x1, cy), (x2, cy)], fill=(100, 116, 139, 200), width=4)
        
        pulse_pos = (progress * 3.0 + i * 0.5) % 1.0
        px = int(x1 + (x2 - x1) * pulse_pos)
        draw.ellipse([(px - 8, cy - 8), (px + 8, cy + 8)], fill=C_CYAN)
        draw.ellipse([(px - 16, cy - 16), (px + 16, cy + 16)], outline=C_CYAN + (120,), width=2)


# UI Simulation 4: Custom AI Dev IDE Terminal
def draw_ai_dev_code_sim(canvas, progress):
    draw = ImageDraw.Draw(canvas, "RGBA")
    
    card_w, card_h = 760, 360
    card_x = W - card_w - 90
    card_y = 140
    
    pop = ease_out_cubic(min(1.0, progress * 2.2))
    cur_y = int(card_y + 40 * (1.0 - pop))
    
    draw.rounded_rectangle(
        [(card_x, cur_y), (card_x + card_w, cur_y + card_h)],
        radius=22,
        fill=(11, 15, 25, 245),
        outline=C_PRIMARY + (220,),
        width=2
    )
    
    # Title bar
    draw.rectangle([(card_x, cur_y), (card_x + card_w, cur_y + 44)], fill=(15, 23, 42, 255))
    draw.ellipse([(card_x + 20, cur_y + 17), (card_x + 30, cur_y + 27)], fill=(239, 68, 68))
    draw.ellipse([(card_x + 38, cur_y + 17), (card_x + 48, cur_y + 27)], fill=(245, 158, 11))
    draw.ellipse([(card_x + 56, cur_y + 17), (card_x + 66, cur_y + 27)], fill=(34, 197, 94))
    draw.text((card_x + 85, cur_y + 12), "inoconnect_enterprise_agent.py", font=get_font(15, bold=True), fill=C_MUTED)
    
    code_lines = [
        ("from", C_ACCENT, " inoconnect.agents ", C_WHITE, "import", C_ACCENT, " EnterpriseGrowthPipeline", C_CYAN),
        ("from", C_ACCENT, " enterprise.rag ", C_WHITE, "import", C_ACCENT, " VectorKnowledgeGraph", C_CYAN),
        ("", C_WHITE),
        ("agent = EnterpriseGrowthPipeline(", C_WHITE, "model='claude-3-7-sonnet'", C_MINT, ")", C_WHITE),
        ("await agent.deploy_autonomous_system(", C_WHITE, "scale_factor='10x'", C_MINT, ")", C_WHITE),
        ("", C_WHITE),
        (">>> [STATUS 200] Model Online  •  Proprietary RAG  •  Active", C_MINT)
    ]
    
    cy = cur_y + 64
    f_code = get_font(18, bold=False)
    for line in code_lines:
        cx = card_x + 32
        for j in range(0, len(line), 2):
            text = line[j]
            col = line[j+1]
            draw.text((cx, cy), text, font=f_code, fill=col)
            bbox = draw.textbbox((0, 0), text, font=f_code)
            cx += (bbox[2] - bbox[0])
        cy += 34


# UI Simulation 5: Web Dev 100/100 PageSpeed Gauge
def draw_pagespeed_100_sim(canvas, progress):
    draw = ImageDraw.Draw(canvas, "RGBA")
    
    card_w, card_h = 620, 340
    card_x = 90
    card_y = 150
    
    pop = ease_out_cubic(min(1.0, progress * 2.0))
    cur_x = int(card_x - 50 * (1.0 - pop))
    
    draw.rounded_rectangle(
        [(cur_x, card_y), (cur_x + card_w, card_y + card_h)],
        radius=24,
        fill=(11, 15, 25, 245),
        outline=C_ACCENT + (220,),
        width=2
    )
    
    draw.text((cur_x + 32, card_y + 24), "LIGHTHOUSE 100 SPEED & CRO AUDIT", font=get_font(17, bold=True), fill=C_ACCENT)
    
    dial_cx = cur_x + 115
    dial_cy = card_y + 145
    radius = 68
    
    draw.ellipse([(dial_cx - radius, dial_cy - radius), (dial_cx + radius, dial_cy + radius)], outline=(30, 41, 59), width=12)
    
    score = int(min(100, 60 + 40 * ease_out_cubic(progress)))
    end_angle = int(score * 3.6) - 90
    draw.arc([(dial_cx - radius, dial_cy - radius), (dial_cx + radius, dial_cy + radius)], start=-90, end=end_angle, fill=C_MINT, width=12)
    
    f_score = get_font(56, bold=True)
    bbox = draw.textbbox((0, 0), str(score), font=f_score)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((dial_cx - tw//2, dial_cy - th//2 - 6), str(score), font=f_score, fill=C_WHITE)
    
    metrics = [
        ("Performance", f"{score}/100", C_MINT),
        ("Global TTFB", "0.28s", C_CYAN),
        ("LCP Speed", "0.42s", C_ACCENT),
        ("Conversion Lift", "+64.2%", C_MINT)
    ]
    
    my = card_y + 75
    for label, val, col in metrics:
        draw.text((cur_x + 235, my), label, font=get_font(18, bold=False), fill=C_MUTED)
        draw.text((cur_x + 470, my), val, font=get_font(19, bold=True), fill=col)
        my += 38
        
    draw.rounded_rectangle([(cur_x + 32, card_y + 265), (cur_x + card_w - 32, card_y + 315)], radius=14, fill=(30, 41, 59, 220))
    draw.text((cur_x + 50, card_y + 278), "Zero Bloat • Astro & Next.js Architecture • Built to Convert", font=get_font(16, bold=True), fill=C_WHITE)


# UI Simulation 6: Content Marketing Editorial Suite
def draw_content_creative_sim(canvas, progress):
    draw = ImageDraw.Draw(canvas, "RGBA")
    
    card_w, card_h = 780, 250
    card_x = (W - card_w) // 2
    card_y = 150
    
    draw.rounded_rectangle(
        [(card_x, card_y), (card_x + card_w, card_y + card_h)],
        radius=24,
        fill=(11, 15, 25, 245),
        outline=C_MINT + (220,),
        width=2
    )
    
    draw.text((card_x + 32, card_y + 22), "DIRECT-RESPONSE CREATIVE & EDITORIAL SUITE", font=get_font(18, bold=True), fill=C_MINT)
    
    wf_x = card_x + 32
    wf_y = card_y + 75
    bar_w = 9
    gap = 5
    num_bars = 46
    
    for i in range(num_bars):
        bx = wf_x + i * (bar_w + gap)
        h_val = int(25 + 40 * abs(math.sin(i * 0.35 + progress * 8.0)))
        draw.rounded_rectangle([(bx, wf_y + 40 - h_val//2), (bx + bar_w, wf_y + 40 + h_val//2)], radius=4, fill=C_CYAN)
        
    pills = [
        ("10x Scroll-Stop Hooks", C_ACCENT),
        ("High-Retention Video", C_MINT),
        ("Editorial Authority", C_WHITE)
    ]
    px = card_x + 32
    for ptext, pcol in pills:
        pw = 230
        draw.rounded_rectangle([(px, card_y + 175), (px + pw, card_y + 220)], radius=14, fill=(30, 41, 59, 240))
        draw.text((px + 20, card_y + 186), ptext, font=get_font(16, bold=True), fill=pcol)
        px += pw + 16


# UI Simulation 7: Social Media Viral Distribution
def draw_social_viral_sim(canvas, progress):
    draw = ImageDraw.Draw(canvas, "RGBA")
    
    card_w, card_h = 580, 330
    card_x = 90
    card_y = 150
    
    pop = ease_out_cubic(min(1.0, progress * 2.0))
    cur_x = int(card_x - 50 * (1.0 - pop))
    
    draw.rounded_rectangle(
        [(cur_x, card_y), (cur_x + card_w, card_y + card_h)],
        radius=24,
        fill=(11, 15, 25, 245),
        outline=C_CYAN + (220,),
        width=2
    )
    
    draw.text((cur_x + 32, card_y + 25), "VIRAL COMMUNITY DISTRIBUTION", font=get_font(17, bold=True), fill=C_CYAN)
    
    cur_views = int(120000 + 720000 * ease_out_cubic(progress))
    draw.text((cur_x + 32, card_y + 68), f"{cur_views:,}+", font=get_font(60, bold=True), fill=C_WHITE)
    draw.text((cur_x + 32, card_y + 145), "ENGAGED REACH THIS MONTH", font=get_font(17, bold=True), fill=C_MINT)
    
    chips = [
        ("❤️ 48.2K Likes & Reactions", C_ACCENT),
        ("💬 3,840 High-Intent Inquiries", C_WHITE),
        ("🔄 12.6K Content Shares", C_CYAN)
    ]
    
    cy = card_y + 185
    for label, col in chips:
        draw.rounded_rectangle([(cur_x + 32, cy), (cur_x + card_w - 32, cy + 38)], radius=12, fill=(30, 41, 59, 200))
        draw.text((cur_x + 50, cy + 9), label, font=get_font(16, bold=True), fill=col)
        cy += 44


# UI Simulation 8: Strategy Executive Attribution Matrix
def draw_strategy_matrix_sim(canvas, progress):
    draw = ImageDraw.Draw(canvas, "RGBA")
    
    card_w, card_h = 800, 260
    card_x = (W - card_w) // 2
    card_y = 140
    
    draw.rounded_rectangle(
        [(card_x, card_y), (card_x + card_w, card_y + card_h)],
        radius=24,
        fill=(11, 15, 25, 245),
        outline=C_PRIMARY + (220,),
        width=2
    )
    
    draw.text((card_x + 36, card_y + 22), "EXECUTIVE ATTRIBUTION & GROWTH ROADMAP", font=get_font(18, bold=True), fill=C_PRIMARY)
    
    stages = [
        ("1. AWARENESS", "100K High Intent", C_MUTED),
        ("2. QUALIFIED", "24K Pipeline", C_CYAN),
        ("3. CONVERTED", "4.2K Closed Won", C_MINT)
    ]
    
    sw = 225
    start_sx = card_x + 36
    sy = card_y + 70
    for i, (title, sub, col) in enumerate(stages):
        sx = start_sx + i * (sw + 26)
        draw.rounded_rectangle([(sx, sy), (sx + sw, sy + 70)], radius=14, fill=(15, 23, 42, 245), outline=col + (150,), width=1)
        draw.text((sx + 16, sy + 14), title, font=get_font(15, bold=True), fill=C_WHITE)
        draw.text((sx + 16, sy + 40), sub, font=get_font(16, bold=True), fill=col)
        
    draw.rounded_rectangle([(card_x + 36, card_y + 165), (card_x + card_w - 36, card_y + 230)], radius=14, fill=(30, 41, 59, 220))
    draw.text((card_x + 60, card_y + 185), "LTV:CAC Ratio: 5.2x  •  Unified Multi-Touch Math  •  Predictable Scale", font=get_font(18, bold=True), fill=C_MINT)


# Scene 0: Hook Scene (High-Impact Disruptive Opening)
def render_hook_scene(frame_idx):
    progress = frame_idx / HOOK_FRAMES
    
    # Authentic modern agency office background with cinematic dark grade
    scale = 1.0 + 0.05 * ease_in_out(progress)
    iw, ih = IMG_OFFICE.size
    cw = int(iw / scale)
    ch = int(ih / scale)
    cx = (iw - cw) // 2
    cy = (ih - ch) // 2
    cropped = IMG_OFFICE.crop((cx, cy, cx + cw, cy + ch))
    bg = cropped.resize((W, H), Image.Resampling.LANCZOS)
    
    # Heavy dark cinematic grade
    dim = Image.new("RGB", (W, H), (11, 15, 25))
    stage = Image.blend(bg, dim, 0.72)
    
    draw = ImageDraw.Draw(stage, "RGBA")
    
    # Ambient radial pulses
    draw.ellipse([(W//2 - 500, H//2 - 400), (W//2 + 500, H//2 + 400)], fill=(65, 105, 225, 40))
    
    # Kinetic Text 1
    t1 = "TIRED OF BURNING AD BUDGETS?"
    f1 = get_font(72, bold=True)
    b1 = draw.textbbox((0, 0), t1, font=f1)
    w1 = b1[2] - b1[0]
    draw.text(((W - w1)//2, 270), t1, font=f1, fill=C_WHITE)
    
    # Kinetic Text 2 (Orange Accent)
    if progress > 0.30:
        t2 = "WE BUILD UNSTOPPABLE REVENUE ENGINES."
        f2 = get_font(44, bold=True)
        b2 = draw.textbbox((0, 0), t2, font=f2)
        w2 = b2[2] - b2[0]
        draw.text(((W - w2)//2, 380), t2, font=f2, fill=C_ACCENT)
        
    # High-converting capsule
    if progress > 0.55:
        pop = ease_out_cubic(min(1.0, (progress - 0.55) / 0.35))
        bw, bh = 840, 64
        bx = (W - bw) // 2
        by = int(520 - 25 * (1.0 - pop))
        draw.rounded_rectangle([(bx, by), (bx + bw, by + bh)], radius=32, fill=(15, 23, 42, 245), outline=C_MINT + (220,), width=2)
        msg = "Disruptive Marketing • Autonomous AI • Verified Attribution"
        b3 = draw.textbbox((0, 0), msg, font=get_font(21, bold=True))
        mw = b3[2] - b3[0]
        draw.text(((W - mw)//2, by + 19), msg, font=get_font(21, bold=True), fill=C_MINT)
        
    return stage


# Scene 9: Climax & CTA Endcard
def render_endcard_scene(frame_idx):
    progress = frame_idx / END_FRAMES
    
    scale = 1.0 + 0.04 * ease_in_out(progress)
    iw, ih = IMG_GROWTH.size
    cw = int(iw / scale)
    ch = int(ih / scale)
    cx = (iw - cw) // 2
    cy = (ih - ch) // 2
    cropped = IMG_GROWTH.crop((cx, cy, cx + cw, cy + ch))
    bg = cropped.resize((W, H), Image.Resampling.LANCZOS)
    
    dim = Image.new("RGB", (W, H), (11, 15, 25))
    stage = Image.blend(bg, dim, 0.78)
    draw = ImageDraw.Draw(stage, "RGBA")
    
    # Official Logo in Center
    if LOGO_IMG:
        lw = 260
        lh = int(lw * LOGO_IMG.height / LOGO_IMG.width)
        logo_res = LOGO_IMG.resize((lw, lh), Image.Resampling.LANCZOS)
        stage = stage.convert("RGBA")
        stage.alpha_composite(logo_res, ((W - lw) // 2, 200))
        stage = stage.convert("RGB")
        draw = ImageDraw.Draw(stage, "RGBA")
        
    # Brand Name
    draw.text(((W - 320)//2, 350), "InoConnect", font=get_font(56, bold=True), fill=C_WHITE)
    
    # Tagline
    tag = "STOP GUESSING. START SCALING."
    b_tag = draw.textbbox((0, 0), tag, font=get_font(42, bold=True))
    tw = b_tag[2] - b_tag[0]
    draw.text(((W - tw)//2, 440), tag, font=get_font(42, bold=True), fill=C_MINT)
    
    sub = "Full-Stack Performance Marketing & Autonomous AI Systems"
    b_sub = draw.textbbox((0, 0), sub, font=get_font(22, bold=False))
    sw = b_sub[2] - b_sub[0]
    draw.text(((W - sw)//2, 508), sub, font=get_font(22, bold=False), fill=C_MUTED)
    
    # CTA Button
    btn_w, btn_h = 540, 70
    btn_x = (W - btn_w) // 2
    btn_y = 590
    
    pulse = 0.5 + 0.5 * math.sin(progress * 8.0)
    draw.rounded_rectangle(
        [(btn_x - 3, btn_y - 3), (btn_x + btn_w + 3, btn_y + btn_h + 3)],
        radius=36,
        fill=C_ACCENT + (int(100 * pulse),)
    )
    draw.rounded_rectangle([(btn_x, btn_y), (btn_x + btn_w, btn_y + btn_h)], radius=35, fill=C_ACCENT + (255,))
    
    cta_text = "GET YOUR STRATEGIC GROWTH AUDIT →"
    b_cta = draw.textbbox((0, 0), cta_text, font=get_font(21, bold=True))
    cw = b_cta[2] - b_cta[0]
    draw.text(((W - cw)//2, btn_y + 22), cta_text, font=get_font(21, bold=True), fill=C_WHITE)
    
    url_text = "inoconnect.com  •  100% Confidential  •  Zero Fluff"
    b_url = draw.textbbox((0, 0), url_text, font=get_font(18, bold=True))
    uw = b_url[2] - b_url[0]
    draw.text(((W - uw)//2, 695), url_text, font=get_font(18, bold=True), fill=C_MUTED)
    
    return stage


# Master Dispatcher
def generate_frame(global_idx):
    if global_idx < HOOK_FRAMES:
        return render_hook_scene(global_idx)
        
    s_idx = (global_idx - HOOK_FRAMES) // SCENE_FRAMES
    f_idx = (global_idx - HOOK_FRAMES) % SCENE_FRAMES
    progress = f_idx / SCENE_FRAMES
    
    if s_idx >= 8:
        return render_endcard_scene(f_idx)
        
    # 8 Services
    if s_idx == 0:  # PPC
        bg = render_16_9_stage(IMG_PPC, progress, side="right")
        draw = ImageDraw.Draw(bg, "RGBA")
        draw_top_stepper(draw, 0)
        draw_live_ppc_hud(bg, progress)
        draw_service_hero_badge(
            bg,
            "PPC & High-Intent Paid Acquisition",
            "Stop wasting ad spend. We engineer profitable Google & Meta campaigns with verified ROAS.",
            ["Scale ROAS to 4.8x+", "-42% Lower Acquisition Cost", "High-Intent Buyer Conversion"],
            C_ACCENT
        )
        return bg
        
    elif s_idx == 1:  # SEO
        bg = render_16_9_stage(IMG_SEO, progress, side="right")
        draw = ImageDraw.Draw(bg, "RGBA")
        draw_top_stepper(draw, 1)
        draw_google_search_sim(bg, progress)
        draw_service_hero_badge(
            bg,
            "SEO & Search Dominance (Organic + AEO)",
            "Capture #1 rankings and Google AI Overviews with technical search architecture.",
            ["Top #1 Ranking Engine", "Compounding Organic Traffic", "AEO Search Optimization"],
            C_MINT
        )
        return bg
        
    elif s_idx == 2:  # AI Auto
        bg = render_16_9_stage(IMG_AUTO, progress)
        draw = ImageDraw.Draw(bg, "RGBA")
        draw_top_stepper(draw, 2)
        draw_ai_automation_sim(bg, progress)
        draw_service_hero_badge(
            bg,
            "AI Automation & 24/7 Lead Routing",
            "Eliminate human lag. Autonomous multi-agent pipelines qualify and route leads in 0.8 seconds.",
            ["< 0.8s Instant Response", "Zero Lead Drop-Off", "Autonomous CRM & WhatsApp Sync"],
            C_CYAN
        )
        return bg
        
    elif s_idx == 3:  # AI Dev
        bg = render_16_9_stage(IMG_AIDEV, progress)
        draw = ImageDraw.Draw(bg, "RGBA")
        draw_top_stepper(draw, 3)
        draw_ai_dev_code_sim(bg, progress)
        draw_service_hero_badge(
            bg,
            "Custom AI Development & Agent Ops",
            "Proprietary fine-tuned LLMs, enterprise RAG, and custom autonomous software systems.",
            ["Proprietary LLM Pipelines", "Enterprise Vector Memory", "10x Operational Velocity"],
            C_PRIMARY
        )
        return bg
        
    elif s_idx == 4:  # Web Dev
        bg = render_16_9_stage(IMG_WEB, progress, side="right")
        draw = ImageDraw.Draw(bg, "RGBA")
        draw_top_stepper(draw, 4)
        draw_pagespeed_100_sim(bg, progress)
        draw_service_hero_badge(
            bg,
            "High-Performance Web Development & CRO",
            "Lightning-fast digital platforms engineered specifically to convert clicks into revenue.",
            ["100/100 PageSpeed Score", "0.4s Ultra-Fast Load", "+64% Conversion Lift"],
            C_ACCENT
        )
        return bg
        
    elif s_idx == 5:  # Content
        bg = render_16_9_stage(IMG_CONTENT, progress, side="right")
        draw = ImageDraw.Draw(bg, "RGBA")
        draw_top_stepper(draw, 5)
        draw_content_creative_sim(bg, progress)
        draw_service_hero_badge(
            bg,
            "Content Marketing & Direct-Response Creative",
            "Scroll-stopping visual narratives and commercial-grade assets that establish industry authority.",
            ["Scroll-Stopping Visuals", "Direct-Response Video Ads", "High Editorial Authority"],
            C_MINT
        )
        return bg
        
    elif s_idx == 6:  # Social
        bg = render_16_9_stage(IMG_SOCIAL, progress, side="right")
        draw = ImageDraw.Draw(bg, "RGBA")
        draw_top_stepper(draw, 6)
        draw_social_viral_sim(bg, progress)
        draw_service_hero_badge(
            bg,
            "Social Media Growth & Community Scaling",
            "Transform cold followers into loyal brand advocates with high-velocity viral distribution.",
            ["Explosive Organic Reach", "High Community Retention", "Multi-Platform Scaling"],
            C_CYAN
        )
        return bg
        
    elif s_idx == 7:  # Strategy
        bg = render_16_9_stage(IMG_STRATEGY, progress)
        draw = ImageDraw.Draw(bg, "RGBA")
        draw_top_stepper(draw, 7)
        draw_strategy_matrix_sim(bg, progress)
        draw_service_hero_badge(
            bg,
            "Digital Strategy & Full-Funnel Attribution",
            "Eliminate marketing guesswork with unified data sovereignty and predictable commercial roadmaps.",
            ["100% Attribution Visibility", "5.2x LTV-to-CAC Ratio", "Zero Guesswork Execution"],
            C_PRIMARY
        )
        return bg
        
    return render_endcard_scene(f_idx)


def main():
    print(f"=== Rendering InoConnect Disruptive Agency Showreel (V2 Ultra) ===")
    print(f"Total Frames: {TOTAL_FRAMES} @ 1920x1080 30FPS (~{TOTAL_FRAMES/FPS:.1f}s)")
    
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
    
    contact_frames = []
    checkpoints = [
        HOOK_FRAMES // 2,
        HOOK_FRAMES + SCENE_FRAMES * 0 + SCENE_FRAMES // 2,
        HOOK_FRAMES + SCENE_FRAMES * 1 + SCENE_FRAMES // 2,
        HOOK_FRAMES + SCENE_FRAMES * 2 + SCENE_FRAMES // 2,
        HOOK_FRAMES + SCENE_FRAMES * 3 + SCENE_FRAMES // 2,
        HOOK_FRAMES + SCENE_FRAMES * 4 + SCENE_FRAMES // 2,
        HOOK_FRAMES + SCENE_FRAMES * 5 + SCENE_FRAMES // 2,
        HOOK_FRAMES + SCENE_FRAMES * 6 + SCENE_FRAMES // 2,
        HOOK_FRAMES + SCENE_FRAMES * 7 + SCENE_FRAMES // 2,
        TOTAL_FRAMES - END_FRAMES // 2
    ]
    
    for i in range(TOTAL_FRAMES):
        frame = generate_frame(i)
        
        if i in checkpoints:
            contact_frames.append(frame.copy())
            
        pipe.stdin.write(frame.tobytes())
        
        if i % 90 == 0 or i == TOTAL_FRAMES - 1:
            print(f"  Frame {i}/{TOTAL_FRAMES} ({i/TOTAL_FRAMES*100:.1f}%) complete...")
            
    pipe.stdin.close()
    pipe.wait()
    print("Raw video pass complete.")
    
    # Storyboard: Proper 16:9 thumbnails (360x202) in 5 cols x 2 rows
    print("Generating High-Res 16:9 Storyboard Sheet...")
    sheet_w, sheet_h = 1920, 1080
    sheet = Image.new("RGB", (sheet_w, sheet_h), (11, 15, 25))
    draw_s = ImageDraw.Draw(sheet)
    
    cols = 5
    rows = 2
    # 16:9 thumb dimensions: 360 x 202
    tw, th = 360, 202
    gap_x = 20
    gap_y = 50
    start_x = (sheet_w - (cols * tw + (cols - 1) * gap_x)) // 2
    start_y = 100
    
    titles = [
        "1. HOOK: STOP BURNING SPEND",
        "2. PPC: SCALED ACQUISITION",
        "3. SEO: #1 GOOGLE RANK",
        "4. AI AUTO: 24/7 AGENT PIPELINE",
        "5. AI DEV: PROPRIETARY LLMS",
        "6. WEB & CRO: 100/100 SPEED",
        "7. CREATIVE: DIRECT RESPONSE",
        "8. SOCIAL: VIRAL DISTRIBUTION",
        "9. STRATEGY: FULL ATTRIBUTION",
        "10. CLIMAX: CLAIM GROWTH AUDIT"
    ]
    
    draw_s.text((start_x, 35), "INOCONNECT — DISRUPTIVE ADVERTISING HOMEPAGE SHOWREEL", font=get_font(28, bold=True), fill=C_WHITE)
    draw_s.text((sheet_w - start_x - 340, 42), "100% RELATABLE SERVICES • 1080P", font=get_font(18, bold=True), fill=C_MINT)
    
    for idx, f in enumerate(contact_frames[:10]):
        thumb = f.resize((tw, th), Image.Resampling.LANCZOS)
        r = idx // cols
        c = idx % cols
        x = start_x + c * (tw + gap_x)
        y = start_y + r * (th + gap_y)
        sheet.paste(thumb, (x, y))
        draw_s.text((x, y - 24), titles[idx], font=get_font(14, bold=True), fill=C_ACCENT)
        # 1px border around thumbnail
        draw_s.rectangle([(x - 1, y - 1), (x + tw, y + th)], outline=(255, 255, 255, 60), width=1)
        
    sheet.save(STORYBOARD_JPG, quality=94)
    print(f"Saved Storyboard Sheet to: {STORYBOARD_JPG}")
    
    # Audio Muxing
    print("Mastering high-energy audio track...")
    audio_dur = TOTAL_FRAMES / FPS
    cmd_audio = [
        FFMPEG,
        "-y",
        "-ss", "00:00:15",
        "-i", AUDIO_IN,
        "-t", str(audio_dur),
        "-filter_complex", f"afade=t=in:st=0:d=0.4,afade=t=out:st={audio_dur-1.5}:d=1.5,loudnorm=I=-14:TP=-1.0:LRA=7",
        MASTERED_WAV
    ]
    subprocess.run(cmd_audio, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    print("Muxing final video with stereo audio...")
    cmd_mux = [
        FFMPEG,
        "-y",
        "-i", RAW_MP4,
        "-i", MASTERED_WAV,
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "256k",
        "-shortest",
        "-movflags", "+faststart",
        FINAL_MP4
    ]
    subprocess.run(cmd_mux, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    shutil.copy2(FINAL_MP4, DOWNLOADS_COPY)
    print(f"Final Hero Video Ready: {FINAL_MP4}")
    print(f"Copied to User Downloads: {DOWNLOADS_COPY}")
    
    if os.path.exists(RAW_MP4):
        os.remove(RAW_MP4)
    if os.path.exists(MASTERED_WAV):
        os.remove(MASTERED_WAV)
        
    print("=== Pipeline Complete! ===")

if __name__ == "__main__":
    main()
