import os
import sys
import subprocess
from generate_clip import generate_video

clips = [
    {
        "name": "Flow Beat 1 - Search",
        "image": r"d:\ino website\videos\flow_stills\flow_beat1_search.jpg",
        "prompt": "thoughtful woman standing near window in dark coat, subtle natural blinking, gentle breathing, soft head tilt, city twilight lights glistening outside, cinematic depth of field",
        "camera": "Zoom In",
        "out": r"d:\ino website\videos\flow_clip1_wan.webm"
    },
    {
        "name": "Flow Beat 2 - Connection",
        "image": r"d:\ino website\videos\flow_stills\flow_beat2_connection.jpg",
        "prompt": "compassionate advisor listening attentively, gentle nod, warm empathetic smile, client gesturing naturally, sunlight streaming through studio",
        "camera": "Pan Right",
        "out": r"d:\ino website\videos\flow_clip2_wan.webm"
    },
    {
        "name": "Flow Beat 3 - Service",
        "image": r"d:\ino website\videos\flow_stills\flow_beat3_service.jpg",
        "prompt": "two professionals discussing blueprint roadmap, pointing at layout with pen, thoughtful nodding, collaborative workplace motion",
        "camera": "Zoom In",
        "out": r"d:\ino website\videos\flow_clip3_wan.webm"
    },
    {
        "name": "Flow Beat 4 - Impact",
        "image": r"d:\ino website\videos\flow_stills\flow_beat4_impact.jpg",
        "prompt": "empowered professional standing on glass terrace overlooking city skyline, hair gently moving in dusk breeze, peaceful confident smile looking forward",
        "camera": "Zoom In",
        "out": r"d:\ino website\videos\flow_clip4_wan.webm"
    }
]

for i, c in enumerate(clips, 1):
    print(f"\n=======================================================")
    print(f" ANIMATING FLOW STILL {i}/{len(clips)}: {c['name']}")
    print(f"=======================================================")
    if os.path.exists(c["out"]) and os.path.getsize(c["out"]) > 10000:
        print(f"Clip already exists at {c['out']}, skipping...")
        continue
    generate_video(c["image"], c["prompt"], c["camera"], c["out"])

print("\nAll 4 Flow stills animated into Wan 2.1 motion clips successfully!")
