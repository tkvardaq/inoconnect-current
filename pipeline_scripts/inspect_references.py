import urllib.request
import re

urls = {
    "ogilvy": "https://www.ogilvy.com/",
    "impactable": "https://impactable.com/",
    "ignite": "https://ignitevisibility.com/",
    "spire": "https://spireagency.com/"
}

for name, url in urls.items():
    print(f"\n=================== {name.upper()} ({url}) ===================")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            print(f"Bytes: {len(html)}")
            
            # Find h1, h2
            h1s = re.findall(r'<h1[^>]*>(.*?)</h1>', html, re.I | re.S)
            print("H1s:", [re.sub(r'<[^>]+>', '', h).strip() for h in h1s[:3]])
            
            h2s = re.findall(r'<h2[^>]*>(.*?)</h2>', html, re.I | re.S)
            print("H2s:", [re.sub(r'<[^>]+>', '', h).strip() for h in h2s[:5]])
            
            # Videos / iframes / backgrounds
            vids = re.findall(r'(https?://[^\s"\'<>]+\.(?:mp4|webm))', html, re.I)
            print("Direct videos:", list(set(vids))[:3])
            
            v_embeds = re.findall(r'(https?://(?:www\.)?(?:vimeo\.com|youtube\.com|wistia)[^\s"\'<>]+)', html, re.I)
            print("Video embeds:", list(set(v_embeds))[:3])
            
            # Look for hero section or video tag
            vt = re.findall(r'<video[^>]*>.*?</video>', html, re.I | re.S)
            print("Video tags count:", len(vt))
            if vt:
                print("First video tag attributes:", re.findall(r'<video([^>]*)>', vt[0], re.I)[0][:200])
    except Exception as e:
        print(f"Error fetching {url}: {e}")
