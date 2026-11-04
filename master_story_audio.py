import subprocess
import os
import wave
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
OUT_DIR = r"d:\ino website\videos"
MUSIC_IN = r"D:\videos for reels\stock\music_623_deep_urban_house.mp3"

act1 = os.path.join(OUT_DIR, "act1_the_trap.wav")
act2 = os.path.join(OUT_DIR, "act2_the_shift.wav")
act3 = os.path.join(OUT_DIR, "act3_the_engine.wav")
act4 = os.path.join(OUT_DIR, "act4_the_climax.wav")

# Timings:
# 0.0s: Silence for 0.5s dramatic beat
# 0.5s: Act 1 (8.45s) -> ends at 8.95s
# 9.2s: Act 2 (5.85s) -> ends at 15.05s
# 15.5s: Act 3 (9.29s) -> ends at 24.79s
# 25.2s: Act 4 (9.41s) -> ends at 34.61s
# Total duration: 35.5 seconds!

MASTERED_AUDIO = os.path.join(OUT_DIR, "inoconnect_story_audio_mastered.wav")

filter_complex = (
    "[1:a]adelay=500|500[v1];"
    "[2:a]adelay=9200|9200[v2];"
    "[3:a]adelay=15500|15500[v3];"
    "[4:a]adelay=25200|25200[v4];"
    "[v1][v2][v3][v4]amix=inputs=4:normalize=0[voice_all];"
    "[0:a]atrim=start=15:duration=35.5,volume=0.35,afade=t=in:st=0:d=1.0,afade=t=out:st=33.5:d=2.0[music];"
    "[voice_all]volume=1.4[voice_boost];"
    "[music][voice_boost]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.0:LRA=7[out]"
)

cmd = [
    FFMPEG, "-y",
    "-i", MUSIC_IN,
    "-i", act1,
    "-i", act2,
    "-i", act3,
    "-i", act4,
    "-filter_complex", filter_complex,
    "-map", "[out]",
    "-ar", "48000",
    "-ac", "2",
    MASTERED_AUDIO
]

subprocess.run(cmd, check=True)
print(f"Mastered story film soundtrack created: {MASTERED_AUDIO}")
