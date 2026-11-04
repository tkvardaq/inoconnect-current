import os
import sys
from generate_clip import generate_video

clips = [
    {
        "name": "Scene 2 - Connection",
        "image": r"d:\ino website\videos\new_scene2_connection.png",
        "prompt": "warm compassionate professional smiling gently and speaking with genuine empathy, subtle nodding and authentic facial expressions, soft natural camera motion",
        "camera": "Pan Right",
        "out": r"d:\ino website\videos\new_clip2_connection.webm"
    },
    {
        "name": "Scene 3 - Service",
        "image": r"d:\ino website\videos\new_scene3_service.png",
        "prompt": "two focused professionals thoughtfully discussing documents, subtle head turn, natural workplace interaction, calm focused collaboration",
        "camera": "Zoom In",
        "out": r"d:\ino website\videos\new_clip3_service.webm"
    },
    {
        "name": "Scene 4 - Impact",
        "image": r"d:\ino website\videos\new_scene4_impact.png",
        "prompt": "confident professional standing by high-rise window at twilight, subtle breath, gentle smile of satisfaction and peace of mind looking out at city lights",
        "camera": "Zoom In",
        "out": r"d:\ino website\videos\new_clip4_impact.webm"
    }
]

for i, c in enumerate(clips, 1):
    print(f"\n=======================================================")
    print(f" PROCESSING CLIP {i}/{len(clips)}: {c['name']}")
    print(f"=======================================================")
    if os.path.exists(c["out"]) and os.path.getsize(c["out"]) > 10000:
        print(f"Clip already exists at {c['out']}, skipping...")
        continue
    generate_video(c["image"], c["prompt"], c["camera"], c["out"])

print("\nAll remaining clips have been generated successfully!")
