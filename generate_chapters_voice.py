import urllib.request
import json
import base64
import subprocess
import os
import wave
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
api_key = os.environ.get("GEMINI_API_KEY", "")
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key={api_key}"

OUT_DIR = r"d:\ino website\videos"
os.makedirs(OUT_DIR, exist_ok=True)

# 4 Script Chapters highlighting why InoConnect is better (value-first, confident, inspiring)
chapters = [
    {
        "id": "act1_the_standard",
        "text": "At InoConnect, we build for brands that demand excellence. We architect full-funnel revenue systems designed to scale your business with absolute precision.",
        "voice": "Puck" # Deep, crisp, authoritative male narrator
    },
    {
        "id": "act2_the_craft",
        "text": "By pairing cinematic brand storytelling with real-time conversion data, our strategists turn high-intent attention into measurable enterprise value.",
        "voice": "Puck"
    },
    {
        "id": "act3_the_ai_engine",
        "text": "Our proprietary AI engines operate twenty-four-seven, qualifying, engaging, and routing ideal buyers in under zero point eight seconds.",
        "voice": "Puck"
    },
    {
        "id": "act4_the_scale",
        "text": "With a four-point-eight-x average ROAS and ninety-eight percent client retention, this is mathematically predictable scale. Welcome to InoConnect. Claim your strategic growth audit today.",
        "voice": "Puck"
    }
]

total_wavs = []
for ch in chapters:
    print(f"Generating voice for: {ch['id']}...")
    payload = {
        "contents": [{"parts": [{"text": ch["text"]}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {
                "voiceConfig": {
                    "prebuiltVoiceConfig": {"voiceName": ch["voice"]}
                }
            }
        }
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    
    with urllib.request.urlopen(req, timeout=30) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        parts = res["candidates"][0]["content"]["parts"]
        for p in parts:
            if "inlineData" in p:
                raw_data = base64.b64decode(p["inlineData"]["data"])
                raw_fn = os.path.join(OUT_DIR, f"{ch['id']}_raw.pcm")
                wav_fn = os.path.join(OUT_DIR, f"{ch['id']}.wav")
                with open(raw_fn, "wb") as f:
                    f.write(raw_data)
                # Convert PCM 24k to 48k stereo WAV
                cmd = [
                    FFMPEG, "-y",
                    "-f", "s16le",
                    "-ar", "24000",
                    "-ac", "1",
                    "-i", raw_fn,
                    "-ar", "48000",
                    "-ac", "2",
                    wav_fn
                ]
                subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                total_wavs.append(wav_fn)
                
                # Check duration
                with wave.open(wav_fn, "rb") as wf:
                    d = wf.getnframes() / wf.getframerate()
                    print(f"  -> Generated {ch['id']}: {d:.2f} seconds")

print(f"All {len(total_wavs)} voiceover chapters generated successfully!")
