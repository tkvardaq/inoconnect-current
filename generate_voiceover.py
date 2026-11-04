import urllib.request
import json
import base64
import subprocess
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
api_key = os.environ.get("GEMINI_API_KEY", "")
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key={api_key}"

payload = {
    "contents": [{
        "parts": [{
            "text": "Every business hits the ceiling. Ad costs climb. Agencies sell activity, not results. InoConnect changes the equation. We engineer autonomous AI pipelines, high-converting creative, and mathematically predictable revenue. Don't just advertise. Dominate."
        }]
    }],
    "generationConfig": {
        "responseModalities": ["AUDIO"],
        "speechConfig": {
            "voiceConfig": {
                "prebuiltVoiceConfig": {
                    "voiceName": "Aoede"  # or Fenrir, Puck, Kore, Charon
                }
            }
        }
    }
}

req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode('utf-8'),
    headers={"Content-Type": "application/json"}
)

try:
    with urllib.request.urlopen(req, timeout=25) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        parts = res['candidates'][0]['content']['parts']
        for p in parts:
            if 'inlineData' in p:
                b64 = p['inlineData']['data']
                raw_path = "d:/ino website/videos/story_voice_raw.pcm"
                wav_path = "d:/ino website/videos/story_voiceover.wav"
                with open(raw_path, "wb") as f:
                    f.write(base64.b64decode(b64))
                # Convert to 48kHz stereo broadcast WAV
                cmd = [
                    FFMPEG, "-y",
                    "-f", "s16le",
                    "-ar", "24000",
                    "-ac", "1",
                    "-i", raw_path,
                    "-ar", "48000",
                    "-ac", "2",
                    wav_path
                ]
                subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                print(f"Generated and converted full story voiceover to: {wav_path}")
except Exception as e:
    print("Voiceover Error:", e)
