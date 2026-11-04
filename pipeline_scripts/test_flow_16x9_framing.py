import cv2, os
from PIL import Image, ImageFilter

vid_dir = r'D:\videos for reels'
downloads = r'C:\Users\talha\Downloads'

clips = [
    ('Ten_people', [f for f in os.listdir(downloads) if 'Ten_people' in f][0], downloads),
    ('Opening_Box', 'Woman_opening_leather_handbag_box_b5258172.mp4', vid_dir),
    ('Parcels_Delivered', [f for f in os.listdir(vid_dir) if 'Parcels' in f][0], vid_dir),
    ('Walking_Cafe', 'Woman_walking_from_cafe_e3ba0da2.mp4', vid_dir)
]

out_dir = r'd:\ino website\videos\test_frames'
W, H = 1920, 1080

sheet = Image.new('RGB', (1920, 1080), (8, 11, 17))
tw, th = 880, 495
coords = [(50, 30), (990, 30), (50, 555), (990, 555)]

for i, (name, fn, folder) in enumerate(clips):
    p = os.path.join(folder, fn)
    cap = cv2.VideoCapture(p)
    cap.set(cv2.CAP_PROP_POS_FRAMES, 50)
    ret, frame = cap.read()
    if ret:
        h, w = frame.shape[:2]
        # 16:9 crop from 720x1280
        # Target aspect is 16/9 = 1.777. Since w=720, to get 16:9 we need h = 720 / (16/9) = 405!
        # That would crop out too much height.
        # What if we do:
        # A) High-end blurred ambient side-wings + sharp center 9:16 vertical frame?
        # OR B) Dual split-screen / dynamic composition?
        
        # Let's test High-End Ambient Side-Wings (like luxury commercials & fashion showcases on 16:9 screens):
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        im_vert = Image.fromarray(frame_rgb)
        
        # Background: zoomed and heavily blurred to fill 1920x1080
        bg_scale = max(W / w, H / h)
        bg_w, bg_h = int(w * bg_scale), int(h * bg_scale)
        bg = im_vert.resize((bg_w, bg_h), Image.Resampling.LANCZOS)
        bg_crop = bg.crop(((bg_w - W)//2, (bg_h - H)//2, (bg_w + W)//2, (bg_h + H)//2))
        bg_blur = bg_crop.filter(ImageFilter.GaussianBlur(35))
        
        # Center: sharp, crystal-clear 9:16 frame with subtle drop shadow
        center_h = H - 112 # fits inside 56px letterbox
        center_w = int(center_h * (w / h))
        center_im = im_vert.resize((center_w, center_h), Image.Resampling.LANCZOS)
        
        comp = bg_blur.copy()
        cx = (W - center_w) // 2
        comp.paste(center_im, (cx, 56))
        
        sheet.paste(comp.resize((tw, th)), coords[i])

out = os.path.join(out_dir, "flow_16x9_test.jpg")
sheet.save(out, quality=95)
print("Saved 16x9 framing test:", out)
