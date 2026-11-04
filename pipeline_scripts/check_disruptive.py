import urllib.request
import re

url = "https://disruptiveadvertising.com/"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
resp = urllib.request.urlopen(req, timeout=15)
html = resp.read().decode('utf-8', errors='ignore')

# find script tags referencing video players or embeds
scripts = re.findall(r'<script[^>]*src=[\'"]([^\'"]+)[\'"]', html, re.I)
for s in scripts:
    if any(k in s.lower() for k in ['video', 'player', 'wistia', 'vimeo', 'embed', 'tube']):
        print("Video script:", s)

# Search for any video embeds or video modal triggers
links = re.findall(r'<a[^>]+href=[\'"]([^\'"]+)[\'"][^>]*>(.*?)</a>', html, re.I | re.S)
for href, text in links:
    if any(k in href.lower() or k in text.lower() for k in ['video', 'watch', 'play', 'showreel', 'meet']):
        clean_text = re.sub(r'<[^>]+>', '', text).strip()
        print(f"Video/Link: {href} -> {clean_text[:60]}")

# Search for background video or data-video
data_vids = re.findall(r'data-[a-z0-9_-]*video[a-z0-9_-]*=[\'"]([^\'"]+)[\'"]', html, re.I)
print("Data videos:", data_vids)
