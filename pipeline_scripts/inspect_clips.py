import os, glob, cv2
import numpy as np

clips_dir = r"D:\videos for reels\stock\clips"
clips = sorted(glob.glob(os.path.join(clips_dir, "*.mp4")))
print(f"Total clips: {len(clips)}")

# Create a montage of middle frames from each clip
cols = 6
rows = (len(clips) + cols - 1) // cols
thumb_w, thumb_h = 320, 180
montage = np.zeros((rows * thumb_h, cols * thumb_w, 3), dtype=np.uint8)

info = []
for i, path in enumerate(clips):
    name = os.path.basename(path)
    cap = cv2.VideoCapture(path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    cap.set(cv2.CAP_PROP_POS_FRAMES, total_frames // 2)
    ret, frame = cap.read()
    cap.release()
    if ret:
        thumb = cv2.resize(frame, (thumb_w, thumb_h))
        # Add label
        cv2.putText(thumb, name, (10, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 3)
        cv2.putText(thumb, name, (10, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
        r = i // cols
        c = i % cols
        montage[r*thumb_h:(r+1)*thumb_h, c*thumb_w:(c+1)*thumb_w] = thumb
        info.append((name, f"{total_frames/fps:.1f}s"))

cv2.imwrite("d:/ino website/videos/stock_clips_overview.jpg", montage)
print("Saved stock_clips_overview.jpg")
for n, dur in info:
    print(f"{n}: {dur}")
