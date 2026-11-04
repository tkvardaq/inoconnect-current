import urllib.request
import json
import base64

api_key = os.environ.get("GEMINI_API_KEY", "")

# Test gemini-2.5-flash-image or gemini-3.1-flash-image or imagen-3.0
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key={api_key}"

payload = {
    "contents": [{
        "parts": [{
            "text": "Cinematic photorealistic 16:9 film still of an elite modern growth agency executive team in a sleek glass conference room, dramatic cinematic lighting, anamorphic lens flare, high production value commercial film."
        }]
    }],
    "generationConfig": {
        "responseModalities": ["IMAGE", "TEXT"]
    }
}

req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode('utf-8'),
    headers={"Content-Type": "application/json"}
)

try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        print("Success! Keys:", res.keys())
        parts = res['candidates'][0]['content']['parts']
        for i, p in enumerate(parts):
            if 'inlineData' in p:
                mime = p['inlineData']['mimeType']
                data = base64.b64decode(p['inlineData']['data'])
                fn = f"d:/ino website/images/gemini_generated_{i}.jpg"
                with open(fn, "wb") as f:
                    f.write(data)
                print(f"Saved generated image: {fn} ({len(data)} bytes, {mime})")
            if 'text' in p:
                print("Text part:", p['text'][:100])
except Exception as e:
    print("Image gen error:", e)
