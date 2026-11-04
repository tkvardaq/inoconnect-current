from PIL import Image
import os, glob

images = [
    ('PPC Visualization', 'service_ppc_visualization_1766962268848.png'),
    ('SEO Visualization', 'service_seo_visualization_1766962251094.png'),
    ('Social Visualization', 'service_social_visualization_1766962344230.png'),
    ('Content Visualization', 'service_content_visualization_1766962324454.png'),
    ('WebDev Visualization', 'service_webdev_visualization_1766962366202.png'),
    ('AI Automation Hero', 'inoconnect_ai_automation_hero.png'),
    ('AI Dev Hero', 'inoconnect_ai_dev_hero.png'),
    ('Strategy Workspace', 'inoconnect_strategy_workspace.png'),
    ('Growth Matrix', 'inoconnect_growth_matrix.png'),
    ('SEO Matrix', 'inoconnect_seo_matrix.png')
]

w, h = 400, 240
sheet = Image.new('RGB', (1600, 720), (15, 23, 42))

for i, (title, fn) in enumerate(images):
    p = os.path.join('d:/ino website/images', fn)
    if os.path.exists(p):
        im = Image.open(p).convert('RGB')
        im.thumbnail((w, h), Image.Resampling.LANCZOS)
        # paste centered in slot
        r = i // 4
        c = i % 4
        x = c * w + (w - im.width)//2
        y = r * h + (h - im.height)//2
        sheet.paste(im, (x, y))

sheet.save('d:/ino website/videos/website_assets_overview.jpg', quality=90)
print('Saved website_assets_overview.jpg')
