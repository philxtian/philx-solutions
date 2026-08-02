(function () {
    'use strict';
    
    if (window.PHILX_INTRO_ACTIVE) return;
    window.PHILX_INTRO_ACTIVE = true;

    const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
    
    // Inject Custom Keyframes: initial bounce + 3 independent firefly drift curves
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes philx-bounce {
            0%   { transform: scale(0);    opacity: 0; }
            60%  { transform: scale(1.3);  opacity: 1; }
            80%  { transform: scale(0.85); opacity: 1; }
            100% { transform: scale(1);    opacity: 1; }
        }

        /* Firefly A – lazy arc, slow breathing */
        @keyframes philx-firefly-a {
            0%   { transform: translate3d(0px,    0px,   0) scale(1.00); opacity: 0.90; }
            15%  { transform: translate3d(-9px,  -14px,  0) scale(1.06); opacity: 0.75; }
            30%  { transform: translate3d( 6px,  -22px,  0) scale(0.94); opacity: 0.95; }
            48%  { transform: translate3d( 14px,  -8px,  0) scale(1.10); opacity: 0.70; }
            63%  { transform: translate3d( 4px,   10px,  0) scale(0.97); opacity: 0.88; }
            78%  { transform: translate3d(-12px,  16px,  0) scale(1.04); opacity: 0.78; }
            90%  { transform: translate3d(-16px,  -4px,  0) scale(0.92); opacity: 0.92; }
            100% { transform: translate3d(0px,    0px,   0) scale(1.00); opacity: 0.90; }
        }

        /* Firefly B – tighter jitter, faster opacity flicker */
        @keyframes philx-firefly-b {
            0%   { transform: translate3d(0px,   0px,  0) scale(1.00); opacity: 0.85; }
            12%  { transform: translate3d( 11px, -10px, 0) scale(1.08); opacity: 0.60; }
            25%  { transform: translate3d( 18px,  6px,  0) scale(0.92); opacity: 0.90; }
            40%  { transform: translate3d( 8px,  18px,  0) scale(1.12); opacity: 0.55; }
            55%  { transform: translate3d(-10px,  12px, 0) scale(0.96); opacity: 0.88; }
            70%  { transform: translate3d(-18px, -6px,  0) scale(1.05); opacity: 0.65; }
            85%  { transform: translate3d(-6px,  -16px, 0) scale(0.90); opacity: 0.95; }
            100% { transform: translate3d(0px,   0px,  0) scale(1.00); opacity: 0.85; }
        }

        /* Firefly C – wide elliptical sweep, slow pulse */
        @keyframes philx-firefly-c {
            0%   { transform: translate3d(0px,    0px,  0) scale(1.00); opacity: 0.80; }
            20%  { transform: translate3d(-14px,  12px, 0) scale(1.07); opacity: 0.65; }
            38%  { transform: translate3d(-20px, -10px, 0) scale(0.95); opacity: 0.92; }
            55%  { transform: translate3d(  2px, -20px, 0) scale(1.09); opacity: 0.58; }
            72%  { transform: translate3d( 16px, -6px,  0) scale(0.93); opacity: 0.88; }
            88%  { transform: translate3d( 10px,  18px, 0) scale(1.03); opacity: 0.70; }
            100% { transform: translate3d(0px,    0px,  0) scale(1.00); opacity: 0.80; }
        }
    `;
    document.head.appendChild(style);

    // Generate cluster of 3 distinct, randomly sized and shaped color patches (Sky Blue, Emerald Green, Deep Teal)
    function generateBlobConstellationHtml() {
        const patches = [
            { color: 'bg-sky-400/90', size: 50 + Math.floor(Math.random() * 25), anim: 'animate-morph-fast' },
            { color: 'bg-emerald-400/85', size: 45 + Math.floor(Math.random() * 25), anim: 'animate-morph-slow' },
            { color: 'bg-teal-500/90', size: 48 + Math.floor(Math.random() * 25), anim: 'animate-morph-reverse' }
        ];

        return patches.map((patch, idx) => {
            const r1 = 30 + Math.floor(Math.random() * 40);
            const r2 = 30 + Math.floor(Math.random() * 40);
            const r3 = 30 + Math.floor(Math.random() * 40);
            const r4 = 30 + Math.floor(Math.random() * 40);
            const r5 = 30 + Math.floor(Math.random() * 40);
            const r6 = 30 + Math.floor(Math.random() * 40);
            const r7 = 30 + Math.floor(Math.random() * 40);
            const r8 = 30 + Math.floor(Math.random() * 40);
            const borderRadius = `${r1}% ${r2}% ${r3}% ${r4}% / ${r5}% ${r6}% ${r7}% ${r8}%`;

            // Random offset positions around center
            const offsetX = (idx === 0) ? -22 + Math.floor(Math.random() * 12) : (idx === 1 ? 16 + Math.floor(Math.random() * 12) : -6 + Math.floor(Math.random() * 12));
            const offsetY = (idx === 0) ? -18 + Math.floor(Math.random() * 12) : (idx === 1 ? 12 + Math.floor(Math.random() * 12) : 18 + Math.floor(Math.random() * 12));

            return `<div id="intro-blob-${idx}" class="absolute ${patch.color} blur-[20px] ${patch.anim} transform-gpu will-change-transform" style="width:${patch.size}px;height:${patch.size}px;border-radius:${borderRadius};transform:translate3d(${offsetX}px, ${offsetY}px, 0);mix-blend-mode:screen;"></div>`;
        }).join('');
    }

    const overlay = document.createElement('div');
    overlay.id = 'intro-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:#000000;z-index:99999;pointer-events:none;transition:opacity 0.75s ease;';

    // Start with a 3D glass sphere in the center, backed by a multi-color randomized blob constellation
    overlay.innerHTML = `
        <div id="intro-blob-container" style="position:fixed;top:50%;left:50%;width:130px;height:130px;margin-top:-65px;margin-left:-65px;z-index:0;opacity:1;display:flex;align-items:center;justify-content:center;will-change:top, left, margin, opacity; transition: top 0.6s ${EASE}, left 0.6s ${EASE}, margin 0.6s ${EASE}, opacity 0.8s ease;">
            ${generateBlobConstellationHtml()}
        </div>

        <div id="intro-bg-pill" class="w-24 h-24 rounded-full bg-white/[0.05] backdrop-blur-3xl border border-white/[0.1] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] transform-gpu will-change-transform" style="position:fixed;top:50%;left:50%;margin-top:-48px;margin-left:-48px;z-index:1;animation: philx-bounce 0.7s cubic-bezier(0.28, 0.84, 0.42, 1) forwards;"></div>
        
        <div id="intro-static-logo" style="position:fixed;top:50%;left:50%;height:36px;margin-top:-18px;margin-left:-18px;z-index:2;opacity:0;will-change:opacity, top, left, margin; display:flex;align-items:center;">
            <img src="assets/logo-mark-white.png" alt="PHILX Logo" style="width:36px;height:36px;object-fit:contain;border-radius:8px;display:block;flex-shrink:0;">
            <div id="intro-logo-text" style="display:flex;align-items:center;opacity:0;overflow:hidden;width:0;will-change:width, opacity;">
                <div style="width:12px;flex-shrink:0;"></div>
                <div style="display:flex;flex-direction:column;justify-content:center;width:72px;flex-shrink:0;">
                    <div style="display:flex;justify-content:space-between;font-weight:900;color:#ffffff;line-height:1;font-size:13px;text-transform:uppercase;">
                        <span>P</span><span>H</span><span>I</span><span>L</span><span>X</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:9px;font-weight:700;color:rgba(255,255,255,0.8);line-height:1;margin-top:4px;text-transform:uppercase;">
                        <span>S</span><span>O</span><span>L</span><span>U</span><span>T</span><span>I</span><span>O</span><span>N</span><span>S</span>
                    </div>
                </div>
            </div>
        </div>
    `;


    function mountOverlay() {
        if (!document.getElementById('intro-overlay')) {
            (document.body || document.documentElement).appendChild(overlay);
        }
    }
    
    if (document.body) mountOverlay();
    else document.addEventListener('DOMContentLoaded', mountOverlay);

    function runSequence() {
        mountOverlay();
        const bgPill = document.getElementById('intro-bg-pill');
        const staticLogo = document.getElementById('intro-static-logo');
        const navbarCapsule = document.getElementById('navbar-capsule');
        const blobContainer = document.getElementById('intro-blob-container');

        if (!bgPill || !staticLogo || !navbarCapsule) {
            overlay.style.opacity = '0';
            return;
        }

        const navItems = navbarCapsule.querySelectorAll('.nav-link, .nav-cta, .nav-mobile-btn');
        navItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            item.style.transition = `opacity 0.4s ${EASE}, transform 0.4s ${EASE}`;
        });

        // Phase 1: Wait for 3D glass sphere to bounce in, then start firefly drift on each blob
        setTimeout(() => {
            bgPill.style.animation = 'none'; // Clear bounce keyframe
            bgPill.style.transition = `width 0.6s ${EASE}, height 0.6s ${EASE}, margin 0.6s ${EASE}, top 0.6s ${EASE}, left 0.6s ${EASE}, border-radius 0.6s ${EASE}, padding 0.6s ${EASE}`;
            bgPill.style.width = '96px';
            bgPill.style.height = '96px';
            bgPill.style.margin = '-48px 0 0 -48px';

            // Kick off independent firefly drift for each blob immediately after bounce settles.
            // Staggered delays desynchronize them so they feel like separate living creatures.
            const fireflyAnims = [
                { name: 'philx-firefly-a', duration: '3.2s', delay: '0s'    },
                { name: 'philx-firefly-b', duration: '2.6s', delay: '0.4s'  },
                { name: 'philx-firefly-c', duration: '4.1s', delay: '0.15s' }
            ];
            fireflyAnims.forEach((cfg, i) => {
                const blob = document.getElementById(`intro-blob-${i}`);
                if (blob) {
                    // Override any morph class animation with the firefly drift curve,
                    // keeping it looping until the overlay dissolves.
                    blob.style.animation = `${cfg.name} ${cfg.duration} ease-in-out ${cfg.delay} infinite`;
                }
            });

            // Phase 2: Fade in perfectly centered Logo Icon
            setTimeout(() => {
                staticLogo.style.transition = 'opacity 0.4s ease';
                staticLogo.style.opacity = '1';

                // Phase 3: Morph cleanly into exact navigation bar pill shape & position
                setTimeout(() => {
                    const navRect = navbarCapsule.getBoundingClientRect();
                    const realLogo = navbarCapsule.querySelector('a') || navbarCapsule.querySelector('img');
                    const exactLogoLeft = realLogo ? realLogo.getBoundingClientRect().left : (navRect.left + 24);

                    bgPill.style.transition = `top 0.6s ${EASE}, left 0.6s ${EASE}, width 0.6s ${EASE}, height 0.6s ${EASE}, margin 0.6s ${EASE}, border-radius 0.6s ${EASE}, padding 0.6s ${EASE}`;
                    staticLogo.style.transition = `top 0.6s ${EASE}, left 0.6s ${EASE}, margin 0.6s ${EASE}`;

                    // Morph initial circle into exact navigation bar pill dimensions & position
                    bgPill.style.top = `${navRect.top}px`;
                    bgPill.style.left = `${navRect.left}px`;
                    bgPill.style.margin = '0px'; 
                    bgPill.style.height = `${navRect.height}px`;
                    bgPill.style.width = `${navRect.width}px`;
                    bgPill.style.borderRadius = '9999px';

                    // Track multi-color randomized blob constellation smoothly behind logo placement in header
                    if (blobContainer) {
                        blobContainer.style.top = `${navRect.top + (navRect.height / 2)}px`;
                        blobContainer.style.left = `${exactLogoLeft + 60}px`;
                        blobContainer.style.margin = '-65px 0 0 -65px';
                    }
                    
                    // Move Logo to upper-left logo position inside navigation bar
                    staticLogo.style.top = `${navRect.top + (navRect.height / 2)}px`;
                    staticLogo.style.left = `${exactLogoLeft}px`;
                    staticLogo.style.margin = `-18px 0 0 0`;

                    // Smoothly unroll the text alongside the logo mark
                    const logoText = document.getElementById('intro-logo-text');
                    if (logoText) {
                        logoText.style.transition = `width 0.6s ${EASE}, opacity 0.6s ${EASE}`;
                        logoText.style.width = '84px'; // 12px gap + 72px text width
                        logoText.style.opacity = '1';
                    }

                    // Phase 4 + 5 unified: settle pill width AND launch orb sweep in the same tick.
                    // No intermediate pause – rAF reveal starts the moment the pill snaps to final width.
                    setTimeout(() => {
                        bgPill.style.width = `${navRect.width}px`;

                        const pillRect  = bgPill.getBoundingClientRect();
                        const sweepDur  = 900; // ms – orb crosses pill interior
                        const orbSize   = 80;  // px – collapsed orb diameter
                        const orbRadius = orbSize / 2;
                        const padRight  = 20;  // px gap from right pill wall

                        const startLeft = exactLogoLeft;
                        const endLeft   = pillRect.right - orbRadius - padRight;

                        if (blobContainer) {
                            // Stop firefly loops – freeze blobs before collapsing to orb shape
                            for (let i = 0; i < 3; i++) {
                                const b = document.getElementById(`intro-blob-${i}`);
                                if (b) b.style.animation = 'none';
                            }

                            // Instant snap to tight orb at logo origin (transition:none prevents interpolation)
                            blobContainer.style.transition = 'none';
                            blobContainer.style.width   = `${orbSize}px`;
                            blobContainer.style.height  = `${orbSize}px`;
                            blobContainer.style.top     = `${pillRect.top + pillRect.height / 2}px`;
                            blobContainer.style.left    = `${startLeft}px`;
                            blobContainer.style.margin  = `-${orbRadius}px 0 0 -${orbRadius}px`;
                            blobContainer.style.opacity = '0.9';

                            // Reflow: commit stable origin before enabling the sweep transition
                            void blobContainer.offsetWidth;

                            // Launch CSS sweep – rAF will read live position each frame
                            blobContainer.style.transition = `left ${sweepDur}ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease`;
                            blobContainer.style.left = `${endLeft}px`;

                            // Dissolve orb at 80% of sweep travel
                            setTimeout(() => { blobContainer.style.opacity = '0'; }, sweepDur * 0.8);
                        }

                        // Snapshot each item's left boundary before the sweep begins.
                        // rAF fires the reveal the exact frame orbTrailX crosses that coordinate.
                        const pending = new Set();
                        navItems.forEach((item) => {
                            const r = item.getBoundingClientRect();
                            pending.add({ item, triggerX: r.left });
                        });

                        const sweepStart = performance.now();
                        let overlayFading = false;

                        function rafReveal(now) {
                            if (pending.size === 0) return;

                            const orbRect   = blobContainer ? blobContainer.getBoundingClientRect() : null;
                            const orbTrailX = orbRect ? orbRect.left + orbRect.width : startLeft;

                            pending.forEach((entry) => {
                                if (orbTrailX >= entry.triggerX) {
                                    entry.item.style.opacity   = '1';
                                    entry.item.style.transform = 'translateY(0)';
                                    pending.delete(entry);
                                }
                            });

                            const elapsed = now - sweepStart;

                            if (pending.size === 0 || elapsed >= sweepDur + 50) {
                                // Force-reveal any stragglers then begin overlay dissolve immediately
                                pending.forEach(({ item }) => {
                                    item.style.opacity   = '1';
                                    item.style.transform = 'translateY(0)';
                                });
                                pending.clear();

                                if (!overlayFading) {
                                    overlayFading = true;
                                    overlay.style.opacity = '0';
                                    setTimeout(() => {
                                        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                                        navItems.forEach(item => {
                                            item.style.opacity   = '';
                                            item.style.transform = '';
                                            item.style.transition = '';
                                        });
                                    }, 750);
                                }
                            } else {
                                requestAnimationFrame(rafReveal);
                            }
                        }

                        // Start rAF immediately – no additional setTimeout wrapper
                        requestAnimationFrame(rafReveal);
                    }, 600); 
                }, 900); // Hold time to admire the centered logo before moving
            }, 400); // Wait for circle to expand before showing logo
        }, 800); // Wait for initial tiny ball bounce animation to finish
    }

    function init() {
        if (document.getElementById('navbar-capsule')) {
            runSequence();
            return;
        }

        let executed = false;
        const trigger = () => {
            if (executed) return;
            executed = true;
            if (observer) observer.disconnect();
            runSequence();
        };

        const observer = new MutationObserver(() => {
            if (document.getElementById('navbar-capsule')) {
                trigger();
            }
        });

        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true
        });

        if (document.body) {
            document.body.addEventListener('htmx:afterSwap', function (evt) {
                if (evt.detail && (evt.detail.target.id === 'navbar-container' || document.getElementById('navbar-capsule'))) {
                    trigger();
                }
            }, { once: true });
        }

        // Failsafe backup timer
        setTimeout(() => {
            if (!executed && document.getElementById('navbar-capsule')) {
                trigger();
            }
        }, 1500);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();