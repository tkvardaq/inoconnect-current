with open(r"d:\ino website\index.html", "r", encoding="utf-8") as f:
    c = f.read()

# Replace headline
target_headline = """Other agencies sell activity.<br class="hidden sm:inline" />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#4169E1] via-[#FF7518] to-[#44D7A8] animate-gradient-text" data-astro-cid-j7pv25f6="">
                We engineer pipeline.
            </span>"""

repl_headline = """Architected For High-Growth Brands.<br class="hidden sm:inline" />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#4169E1] via-[#FF7518] to-[#44D7A8] animate-gradient-text" data-astro-cid-j7pv25f6="">
                We engineer predictable pipeline.
            </span>"""

target_manifesto = """Stop paying retainers for agencies to learn on your dime. InoConnect unifies direct-response creative with autonomous AI execution to turn ad budgets into mathematically measurable revenue."""

repl_manifesto = """Where tier-one creative strategy meets autonomous AI intelligence. InoConnect builds full-funnel acquisition systems that turn high-intent attention into compounding commercial revenue."""

c = c.replace(target_headline, repl_headline)
c = c.replace(target_manifesto, repl_manifesto)
c = c.replace("Watch The Film (35s)", "Watch The Reel (24s)")
c = c.replace('preload="metadata" loop playsinline controls>', 'preload="metadata" autoplay muted loop playsinline controls>')

with open(r"d:\ino website\index.html", "w", encoding="utf-8") as f:
    f.write(c)

print("index.html updated successfully!")
