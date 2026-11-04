import urllib.request
import json

api_key = os.environ.get("GEMINI_API_KEY", "")

# List supported generation methods for models
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
req = urllib.request.Request(url)
with urllib.request.urlopen(req, timeout=10) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    for m in data.get('models', []):
        methods = m.get('supportedGenerationMethods', [])
        if 'generateContent' in methods:
            print(f"Model: {m['name']} -> {methods}")
