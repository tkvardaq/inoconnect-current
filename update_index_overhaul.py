with open("d:/ino website/index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Locate the hero section
start_marker = '<section class="relative bg-white pt-32 pb-20 overflow-hidden" data-astro-cid-j7pv25f6="">'
end_marker = '</section>\n<section class="bg-white border-y border-slate-100 py-12 relative overflow-hidden"'

new_hero = '''<section class="relative bg-white pt-32 pb-20 overflow-hidden" data-astro-cid-j7pv25f6="">
<!-- Animated Gradient Background -->
<div class="absolute inset-0 overflow-hidden pointer-events-none" data-astro-cid-j7pv25f6="">
    <div class="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[#4169E1]/10 via-[#FF7518]/10 to-[#44D7A8]/10 blur-3xl animate-gradient" data-astro-cid-j7pv25f6=""></div>
    <div class="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-[#44D7A8]/10 via-[#4169E1]/10 to-[#FF7518]/10 blur-3xl animate-gradient-reverse" data-astro-cid-j7pv25f6=""></div>
</div>
<div class="max-w-7xl mx-auto px-6 relative z-10" data-astro-cid-j7pv25f6="">
    <div class="max-w-5xl mx-auto text-center" data-astro-cid-j7pv25f6="">
        
        <!-- Top Credibility Pill (Impactable / Clutch / Spire) -->
        <div class="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-900/5 border border-slate-200/90 backdrop-blur-md mb-8 hover:bg-slate-900/10 transition-all cursor-default">
            <span class="flex h-2.5 w-2.5 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#44D7A8] opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#44D7A8]"></span>
            </span>
            <span class="text-xs font-black uppercase tracking-wider text-slate-800">
                Top-Rated Growth &amp; AI Performance Partner
            </span>
            <span class="text-slate-300">•</span>
            <span class="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span class="text-amber-500">★★★★★</span> 4.9/5 on Clutch
            </span>
        </div>

        <!-- Master Stance Headline (Impactable & Ogilvy) -->
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.05] tracking-tight text-slate-900" data-astro-cid-j7pv25f6="">
            Other agencies sell activity.<br class="hidden sm:inline" />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#4169E1] via-[#FF7518] to-[#44D7A8] animate-gradient-text" data-astro-cid-j7pv25f6="">
                We engineer pipeline.
            </span>
        </h1>

        <!-- Manifesto Sub-headline -->
        <p class="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto font-medium" data-astro-cid-j7pv25f6="">
            Stop paying retainers for agencies to learn on your dime. InoConnect unifies direct-response creative with autonomous AI execution to turn ad budgets into mathematically predictable revenue.
        </p>

        <!-- CTA Action Bar -->
        <div class="flex flex-col sm:flex-row gap-5 justify-center items-center reveal-on-scroll stagger-2" data-astro-cid-j7pv25f6="">
            <a class="w-full sm:w-auto px-10 py-5 bg-[#FF7518] hover:bg-[#e06612] text-white font-black rounded-full transition-all hover:scale-105 text-lg shadow-xl shadow-orange-500/25 flex items-center justify-center gap-3" data-astro-cid-j7pv25f6="" href="/contact">
                <span>Claim Your Growth Audit</span>
                <span class="text-xl">→</span>
            </a>
            <a class="w-full sm:w-auto px-8 py-5 bg-white text-slate-900 border border-slate-200 hover:border-slate-300 font-bold rounded-full transition-all hover:bg-slate-50 text-lg flex items-center justify-center gap-3 group shadow-sm" href="#hero-cinema-showcase">
                <span class="w-8 h-8 rounded-full bg-blue-50 text-[#4169E1] flex items-center justify-center group-hover:scale-110 transition-transform">▶</span>
                <span>Watch The Film (35s)</span>
            </a>
        </div>

        <!-- Hard-Proof Metrics Ribbon (Ignite Visibility & Impactable style) -->
        <div class="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 py-6 px-8 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/90 shadow-sm">
            <div class="text-center md:border-r border-slate-100">
                <div class="text-3xl lg:text-4xl font-black text-slate-900">4.8x</div>
                <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Average ROAS</div>
            </div>
            <div class="text-center md:border-r border-slate-100">
                <div class="text-3xl lg:text-4xl font-black text-[#44D7A8]">98%</div>
                <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Client Retention</div>
            </div>
            <div class="text-center md:border-r border-slate-100">
                <div class="text-3xl lg:text-4xl font-black text-[#4169E1]">$38M+</div>
                <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Attributed Revenue</div>
            </div>
            <div class="text-center">
                <div class="text-3xl lg:text-4xl font-black text-[#FF7518]">&lt; 0.8s</div>
                <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">AI Lead Routing</div>
            </div>
        </div>

        <!-- Cinema Story Film Showcase (Spire Agency & Ignite Visibility style) -->
        <div id="hero-cinema-showcase" class="mt-14 max-w-5xl mx-auto relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-200/90 bg-slate-950 group">
            <!-- Ambient Color-Bleed Backglow -->
            <div class="absolute -inset-1 bg-gradient-to-r from-[#4169E1] via-[#FF7518] to-[#44D7A8] rounded-3xl blur-2xl opacity-20 group-hover:opacity-35 transition-opacity duration-700 pointer-events-none"></div>
            
            <div class="relative aspect-video w-full bg-slate-950">
                <video id="hero-showreel-video" class="w-full h-full object-cover" poster="/videos/inoconnect_hero_storyboard.jpg" preload="metadata" loop playsinline controls>
                    <source src="/videos/inoconnect-hero-showreel.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            
            <!-- Custom Cinema Bar with Story Chapters -->
            <div class="relative p-4 bg-slate-900/95 backdrop-blur-md flex flex-wrap items-center justify-between text-xs text-slate-300 px-6 border-t border-slate-800">
                <div class="flex items-center gap-3">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#44D7A8] animate-pulse"></span>
                    <span class="font-bold tracking-wider text-white uppercase">InoConnect: The Physics of Growth (35s)</span>
                    <span class="text-slate-600 hidden md:inline">•</span>
                    <span class="text-slate-400 hidden md:inline font-mono">Act I: The Trap → Act II: The Shift → Act III: The Engine → Act IV: Scale</span>
                </div>
                <div class="flex items-center gap-4 mt-2 sm:mt-0 font-medium">
                    <span class="text-[#FF7518] font-bold">Narration + Score</span>
                    <a href="/contact" class="hover:text-white transition-colors underline font-bold text-[#44D7A8]">Claim Growth Audit →</a>
                </div>
            </div>
        </div>

    </div>
</div>
</section>'''

if start_marker in content:
    idx_start = content.find(start_marker)
    idx_end = content.find(end_marker)
    if idx_end != -1:
        updated = content[:idx_start] + new_hero + content[idx_end + len('</section>'):]
        with open("d:/ino website/index.html", "w", encoding="utf-8") as f:
            f.write(updated)
        print("index.html hero section successfully overhauled!")
    else:
        print("Error: end_marker not found")
else:
    print("Error: start_marker not found")
