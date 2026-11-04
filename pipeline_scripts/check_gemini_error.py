import urllib.request
import urllib.error
import json

api_key = os.environ.get("GEMINI_API_KEY", "")
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key={api_key}"

payload = {
    "contents": [{"parts": [{"text": "A modern agency office"}]}],
    "generationConfig": {"responseModalities": ["IMAGE"]}
}

req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode('utf-8'),
    headers={"Content-Type": "application/json"}
)

try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        print("Success")
except urllib.error.HTTPError as e:
    err_body = e.read().decode('utf-8', errors='ignore')
    print("HTTP Error code:", e.code)
    print("Error body:", err_body)
