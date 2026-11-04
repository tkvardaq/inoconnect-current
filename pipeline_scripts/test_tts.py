import urllib.request
import json
import base64

api_key = os.environ.get("GEMINI_API_KEY", "")

# Test gemini-2.5-flash-preview-tts or gemini-3.1-flash-tts-preview
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key={api_key}"

payload = {
    "contents": [{
        "parts": [{
            "text": "Most agencies sell activity. We engineer revenue. Welcome to InoConnect."
        }]
    }],
    "generationConfig": {
        "responseModalities": ["AUDIO"]
    }
}

req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode('utf-8'),
    headers={"Content-Type": "application/json"}
)

try:
    with urllib.request.urlopen(req, timeout=20) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        print("Success! Response keys:", res.keys())
        parts = res['candidates'][0]['content']['parts']
        for p in parts:
            if 'inlineData' in p:
                mime = p['inlineData']['mimeType']
                b64 = p['inlineData']['data']
                print(f"Received audio: {mime}, {len(b64)} b64 bytes")
                with open("d:/ino website/videos/test_tts.mp3", "wb") as f:
                    f.write(base64.b64decode(b64))
                print("Saved d:/ino website/videos/test_tts.mp3!")
except Exception as e:
    print("TTS Error:", e)
