import urllib.request
import json

api_key = os.environ.get("GEMINI_API_KEY", "")
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        models = data.get('models', [])
        print(f"Total models: {len(models)}")
        for m in models:
            name = m['name']
            desc = m.get('description', '')
            methods = m.get('supportedGenerationMethods', [])
            if any(k in name.lower() or k in desc.lower() for k in ['video', 'veo', 'flow', 'imagen', 'media', 'generateimages']):
                print(f"Match: {name} | Methods: {methods}")
except Exception as e:
    print("Error:", e)
