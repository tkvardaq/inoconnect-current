import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');

// Find the hero section inside <main>
const heroStart = content.indexOf('<section class="relative bg-white pt-32 pb-20 overflow-hidden"');
const heroEnd = content.indexOf('</section>', heroStart) + 10;

const newHeroSection = `<section class="relative bg-white pt-28 pb-14 overflow-hidden" data-astro-cid-j7pv25f6="">
<!-- Animated Gradient Background -->
<div class="absolute inset-0 overflow-hidden pointer-events-none" data-astro-cid-j7pv25f6="">
    <div class="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[#4169E1]/10 via-[#FF7518]/10 to-[#44D7A8]/10 blur-3xl animate-gradient" data-astro-cid-j7pv25f6=""></div>
    <div class="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-[#44D7A8]/10 via-[#4169E1]/10 to-[#FF7518]/10 blur-3xl animate-gradient-reverse" data-astro-cid-j7pv25f6=""></div>
</div>
<div class="max-w-7xl mx-auto px-6 relative z-10" data-astro-cid-j7pv25f6="">
    <div class="max-w-5xl mx-auto text-center" data-astro-cid-j7pv25f6="">
        
        <!-- Accessible SEO H1 -->
        <h1 class="sr-only">InoConnect — Autonomous Growth Systems, Performance Media &amp; AI Engineering</h1>

        <!-- Cinema Video Showcase -->
        <div id="hero-cinema-showcase" class="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/15 border border-slate-200/90 bg-slate-950 group">
            <!-- Ambient Color-Bleed Backglow -->
            <div class="absolute -inset-1 bg-gradient-to-r from-[#4169E1] via-[#FF7518] to-[#44D7A8] rounded-3xl blur-2xl opacity-20 group-hover:opacity-35 transition-opacity duration-700 pointer-events-none"></div>
            
            <div class="relative aspect-video w-full bg-slate-950">
                <video id="hero-showreel-video" class="w-full h-full object-cover" poster="/videos/inoconnect_hero_storyboard.jpg" preload="metadata" autoplay muted loop playsinline>
                    <source src="/videos/inoconnect-hero-showreel.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                <!-- Audio Toggle Control Button -->
                <button id="hero-sound-toggle" type="button" class="absolute bottom-5 right-5 z-30 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 backdrop-blur-md text-xs font-bold tracking-wider transition-all hover:scale-105 shadow-xl cursor-pointer" aria-label="Toggle video audio">
                    <svg id="hero-sound-icon-muted" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>
                    <svg id="hero-sound-icon-unmuted" class="w-4 h-4 text-[#44D7A8] hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
                    <span id="hero-sound-label">Unmute</span>
                </button>
            </div>
        </div>

        <!-- Hero Action CTAs Directly Below Video -->
        <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a class="w-full sm:w-auto px-10 py-4 bg-[#FF7518] hover:bg-[#e06612] text-white font-black rounded-full transition-all hover:scale-105 text-base sm:text-lg shadow-xl shadow-orange-500/25 flex items-center justify-center gap-3" href="/contact">
                <span>Claim Your Growth Audit</span>
                <span class="text-xl">→</span>
            </a>
            <a class="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 hover:border-slate-300 font-bold rounded-full transition-all hover:bg-slate-50 text-base sm:text-lg flex items-center justify-center gap-3 group shadow-sm" href="/services">
                <span class="w-8 h-8 rounded-full bg-blue-50 text-[#4169E1] flex items-center justify-center group-hover:scale-110 transition-transform">⚡</span>
                <span>Explore Growth Services</span>
            </a>
        </div>

    </div>
</div>
</section>`;

content = content.slice(0, heroStart) + newHeroSection + content.slice(heroEnd);

// Add sound toggle script before </body>
const soundScript = `
<script>
  (function() {
    const video = document.getElementById('hero-showreel-video');
    const toggle = document.getElementById('hero-sound-toggle');
    const iconMuted = document.getElementById('hero-sound-icon-muted');
    const iconUnmuted = document.getElementById('hero-sound-icon-unmuted');
    const label = document.getElementById('hero-sound-label');

    if (video && toggle) {
      toggle.addEventListener('click', function() {
        video.muted = !video.muted;
        if (video.muted) {
          if (iconMuted) iconMuted.classList.remove('hidden');
          if (iconUnmuted) iconUnmuted.classList.add('hidden');
          if (label) label.textContent = 'Unmute';
        } else {
          if (iconMuted) iconMuted.classList.add('hidden');
          if (iconUnmuted) iconUnmuted.classList.remove('hidden');
          if (label) label.textContent = 'Mute';
          // attempt play if paused
          video.play().catch(function() {});
        }
      });
    }
  })();
</script>
`;

if (!content.includes('hero-sound-toggle')) {
  content = content.replace('</body>', `${soundScript}\n</body>`);
} else if (!content.includes("document.getElementById('hero-sound-toggle')")) {
  content = content.replace('</body>', `${soundScript}\n</body>`);
}

fs.writeFileSync('index.html', content, 'utf8');
console.log('Successfully redesigned hero layout in index.html!');
