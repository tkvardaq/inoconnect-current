import os
import urllib.request
import json

api_key = os.environ.get("GEMINI_API_KEY", "")
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

req = urllib.request.Request(url)
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print("API Key is VALID! Models available:")
        models = [m['name'] for m in data.get('models', [])]
        for m in models:
            if any(k in m.lower() for k in ['gemini-2.5', 'gemini-2.0', 'veo', 'video', 'imagen']):
                print("  -", m)
except Exception as e:
    print("API Error:", e)
