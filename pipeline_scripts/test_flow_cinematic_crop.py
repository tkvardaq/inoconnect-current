import cv2, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

vid_dir = r'D:\videos for reels'
downloads = r'C:\Users\talha\Downloads'
FONT_PATH = r'D:\videos for reels\fonts\Outfit-Variable.ttf'

clips = [
    ('Ten_people', [f for f in os.listdir(downloads) if 'Ten_people' in f][0], downloads, 0.25, "01 // ATTENTION", "THEY STOP."),
    ('Opening_Box', 'Woman_opening_leather_handbag_box_b5258172.mp4', vid_dir, 0.20, "02 // EMOTION", "THEY FEEL."),
    ('Parcels_Delivered', [f for f in os.listdir(vid_dir) if 'Parcels' in f][0], vid_dir, 0.25, "03 // CERTAINTY", "THEY BELIEVE."),
    ('Walking_Cafe', 'Woman_walking_from_cafe_e3ba0da2.mp4', vid_dir, 0.15, "04 // ACTION", "THEY CHOOSE YOU.")
]

out_dir = r'd:\ino website\videos\test_frames'
W, H = 1920, 1080

sheet = Image.new('RGB', (1920, 1080), (8, 11, 17))
tw, th = 880, 495
coords = [(50, 30), (990, 30), (50, 555), (990, 555)]

f_tag = ImageFont.truetype(FONT_PATH, 16)
f_main = ImageFont.truetype(FONT_PATH, 68)

for i, (name, fn, folder, y_bias, tag_txt, main_txt) in enumerate(clips):
    p = os.path.join(folder, fn)
    cap = cv2.VideoCapture(p)
    cap.set(cv2.CAP_PROP_POS_FRAMES, 50)
    ret, frame = cap.read()
    if ret:
        h, w = frame.shape[:2]
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        im = Image.fromarray(frame_rgb)
        
        # Scale to fill W=1920
        scale = W / w
        nw, nh = int(w * scale), int(h * scale)
        im_large = im.resize((nw, nh), Image.Resampling.LANCZOS)
        
        # Crop vertically according to y_bias (0.0=top, 0.5=center, 1.0=bottom)
        max_y = nh - H
        crop_y = int(max_y * y_bias)
        cropped = im_large.crop((0, crop_y, W, crop_y + H))
        
        # Letterbox Cinema Bars
        draw = ImageDraw.Draw(cropped, "RGBA")
        draw.rectangle([(0, 0), (W, 56)], fill=(8, 11, 17, 255))
        draw.rectangle([(0, H - 56), (W, H)], fill=(8, 11, 17, 255))
        draw.line([(0, 56), (W, 56)], fill=(65, 105, 225, 90), width=1)
        draw.line([(0, H - 56), (W, H - 56)], fill=(65, 105, 225, 90), width=1)
        
        # Glass card lower third
        b_tag = draw.textbbox((0, 0), tag_txt, font=f_tag)
        w_tag = b_tag[2] - b_tag[0]
        b_main = draw.textbbox((0, 0), main_txt, font=f_main)
        w_main = b_main[2] - b_main[0]
        
        content_w = max(w_tag, w_main)
        box_w = min(W - 120, content_w + 120)
        box_h = 130
        box_x = (W - box_w) // 2
        box_y = 780
        
        # Obsidian glass card
        draw.rounded_rectangle([(box_x, box_y), (box_x + box_w, box_y + box_h)], radius=20, fill=(8, 11, 17, 235), outline=(255, 255, 255, 45), width=1)
        
        tag_colors = [(0, 210, 255), (255, 117, 24), (68, 215, 168), (255, 195, 75)]
        tc = tag_colors[i]
        draw.rounded_rectangle([(box_x + 8, box_y + 14), (box_x + 13, box_y + box_h - 14)], radius=3, fill=tc + (255,))
        draw.text(((W - w_tag)//2, box_y + 18), tag_txt, font=f_tag, fill=tc + (240,))
        
        tx = (W - w_main) // 2
        ty = box_y + 44
        draw.text((tx + 1, ty + 1), main_txt, font=f_main, fill=(0, 0, 0, 200))
        draw.text((tx, ty), main_txt, font=f_main, fill=(255, 255, 255, 255))
        
        sheet.paste(cropped.resize((tw, th)), coords[i])

out = os.path.join(out_dir, "flow_cinematic_crop_test.jpg")
sheet.save(out, quality=95)
print("Saved cinematic crop test:", out)
