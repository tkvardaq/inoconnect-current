/**
 * InoConnect x Framer Components Controller
 * Manages 3D tilt, magnetic spotlight, particle field, holographic sphere,
 * and Advanced Bento Grid interactions.
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        initWorkshopExperiences();
        initAdvancedBentoGrids();
    });

    /* ==========================================================================
       Workshop Experience Initialization
       ========================================================================== */
    function initWorkshopExperiences() {
        const containers = document.querySelectorAll('.workshop-container');
        if (!containers.length) return;

        containers.forEach(container => {
            const spotlight = container.querySelector('.workshop-spotlight');
            const sphere = container.querySelector('.workshop-sphere-anchor');
            const orbitContainer = container.querySelector('.workshop-orbit-container');
            const nexusBadge = container.querySelector('.workshop-nexus-badge');
            const cards = container.querySelectorAll('.workshop-card');

            // Mouse coordinates with spring smoothing
            let mouseX = 0;
            let mouseY = 0;
            let targetX = 0;
            let targetY = 0;
            let isInside = false;

            // Update mouse tracking
            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                targetX = e.clientX - rect.left;
                targetY = e.clientY - rect.top;
                isInside = true;
            });

            container.addEventListener('mouseleave', () => {
                isInside = false;
            });

            // Smooth spring loop for spotlight
            function renderSpotlight() {
                if (spotlight && isInside) {
                    mouseX += (targetX - mouseX) * 0.12;
                    mouseY += (targetY - mouseY) * 0.12;
                    spotlight.style.left = `${mouseX}px`;
                    spotlight.style.top = `${mouseY}px`;
                }
                requestAnimationFrame(renderSpotlight);
            }
            requestAnimationFrame(renderSpotlight);

            // Particles Canvas
            initParticlesCanvas(container);

            // Holographic Sphere Core Interactions
            if (sphere) {
                const modes = [
                    { label: 'Active Nexus: 99.4% Attribution Confidence', color: '#44D7A8' },
                    { label: 'Agentic Mode: 24/7 Autonomous Pipeline', color: '#4169E1' },
                    { label: 'Predictive Bidding: Sub-Second ML Routing', color: '#FF7518' }
                ];
                let currentMode = 0;

                sphere.addEventListener('click', () => {
                    currentMode = (currentMode + 1) % modes.length;
                    if (nexusBadge) {
                        nexusBadge.textContent = modes[currentMode].label;
                        nexusBadge.style.borderColor = modes[currentMode].color;
                        nexusBadge.style.color = modes[currentMode].color;
                        nexusBadge.style.boxShadow = `0 0 25px ${modes[currentMode].color}66`;
                    }
                    if (orbitContainer) {
                        orbitContainer.classList.add('active');
                        setTimeout(() => orbitContainer.classList.remove('active'), 2500);
                    }
                });
            }

            // 3D Card Tilt with Perspective
            cards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const cardX = e.clientX - rect.left;
                    const cardY = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = ((cardY - centerY) / centerY) * -12;
                    const rotateY = ((cardX - centerX) / centerX) * 12;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04) translateY(-6px)`;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0px)';
                });
            });
        });
    }

    /* ==========================================================================
       Particles Canvas Engine
       ========================================================================== */
    function initParticlesCanvas(container) {
        let canvas = container.querySelector('.workshop-particles-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.className = 'workshop-particles-canvas';
            container.appendChild(canvas);
        }

        const ctx = canvas.getContext('2d');
        let width = (canvas.width = container.offsetWidth);
        let height = (canvas.height = container.offsetHeight);

        window.addEventListener('resize', () => {
            width = canvas.width = container.offsetWidth;
            height = canvas.height = container.offsetHeight;
        });

        const particleColors = ['#4169E1', '#44D7A8', '#FF7518', '#00FFFF'];
        const particles = Array.from({ length: 35 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2.5 + 1,
            speedY: Math.random() * 0.6 + 0.2,
            swaySpeed: Math.random() * 0.02 + 0.005,
            swayOffset: Math.random() * Math.PI * 2,
            swayRadius: Math.random() * 25 + 10,
            opacity: Math.random() * 0.6 + 0.2,
            color: particleColors[Math.floor(Math.random() * particleColors.length)]
        }));

        let time = 0;
        function animate() {
            ctx.clearRect(0, 0, width, height);
            time += 1;

            particles.forEach(p => {
                p.y -= p.speedY;
                if (p.y < -10) {
                    p.y = height + 10;
                    p.x = Math.random() * width;
                }

                const currentX = p.x + Math.sin(time * p.swaySpeed + p.swayOffset) * p.swayRadius;

                ctx.save();
                ctx.beginPath();
                ctx.arc(currentX, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.shadowBlur = p.size * 4;
                ctx.shadowColor = p.color;
                ctx.fill();
                ctx.restore();
            });

            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    }

    /* ==========================================================================
       Advanced Bento Grid Filtering & Interactions
       ========================================================================== */
    function initAdvancedBentoGrids() {
        const bentoContainers = document.querySelectorAll('.bento-showcase-container');
        if (!bentoContainers.length) return;

        bentoContainers.forEach(container => {
            const filterBtns = container.querySelectorAll('.bento-filter-btn');
            const cards = container.querySelectorAll('.bento-card');

            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const filter = btn.getAttribute('data-filter') || 'all';

                    // Update active button state
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    // Filter cards
                    cards.forEach(card => {
                        const category = card.getAttribute('data-category') || '';
                        if (filter === 'all' || category.includes(filter)) {
                            card.style.opacity = '1';
                            card.style.pointerEvents = 'auto';
                            card.style.transform = 'scale(1)';
                        } else {
                            card.style.opacity = '0.2';
                            card.style.pointerEvents = 'none';
                            card.style.transform = 'scale(0.96)';
                        }
                    });
                });
            });
        });
    }
})();
