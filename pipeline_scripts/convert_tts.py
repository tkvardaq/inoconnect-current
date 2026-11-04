import subprocess
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

cmd = [
    FFMPEG, "-y",
    "-f", "s16le",
    "-ar", "24000",
    "-ac", "1",
    "-i", "d:/ino website/videos/test_tts.mp3",
    "d:/ino website/videos/test_voiceover.wav"
]
subprocess.run(cmd, check=True)
print("Converted raw PCM to broadcast WAV successfully!")
