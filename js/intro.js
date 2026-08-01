(function () {
    'use strict';
    
    if (window.PHILX_INTRO_ACTIVE) return;
    window.PHILX_INTRO_ACTIVE = true;

    const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
    
    // Inject Custom Keyframes for the initial tiny ball bounce
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes philx-bounce {
            0% { transform: scale(0); opacity: 0; }
            60% { transform: scale(1.3); opacity: 1; }
            80% { transform: scale(0.85); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'intro-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:#000000;z-index:99999;pointer-events:none;transition:opacity 0.75s ease;';

    // Start with a 3D glass sphere in the center matching navbar frosted glass styling, backed by a vibrant refracting color blob
    overlay.innerHTML = `
        <div id="intro-blob" class="w-[320px] h-[320px] rounded-full bg-gradient-to-tr from-cyan-400/80 via-teal-500/70 to-blue-600/80 blur-[80px] animate-morph-fast transform-gpu will-change-transform" style="position:fixed;top:50%;left:50%;margin-top:-160px;margin-left:-160px;z-index:0;opacity:0.95;will-change:top, left, margin, opacity; transition: top 0.6s cubic-bezier(0.16, 1, 0.3, 1), left 0.6s cubic-bezier(0.16, 1, 0.3, 1), margin 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease;"></div>

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
        const introBlob = document.getElementById('intro-blob');

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

        // Phase 1: Wait for 3D glass sphere to bounce in, then prepare smooth transition properties
        setTimeout(() => {
            bgPill.style.animation = 'none'; // Clear keyframe
            bgPill.style.transition = `width 0.6s ${EASE}, height 0.6s ${EASE}, margin 0.6s ${EASE}, top 0.6s ${EASE}, left 0.6s ${EASE}, border-radius 0.6s ${EASE}`;
            bgPill.style.width = '96px';
            bgPill.style.height = '96px';
            bgPill.style.margin = '-48px 0 0 -48px';


            // Phase 2: Fade in perfectly centered Logo Icon
            setTimeout(() => {
                staticLogo.style.transition = 'opacity 0.4s ease';
                staticLogo.style.opacity = '1';

                // Phase 3: Move to navbar left and morph to short pill, tracking intro blob
                setTimeout(() => {
                    const navRect = navbarCapsule.getBoundingClientRect();
                    const safeHeight = Math.min(navRect.height, 80); 
                    const targetTop = navRect.top + (safeHeight / 2); 
                    
                    const realLogo = navbarCapsule.querySelector('a') || navbarCapsule.querySelector('img');
                    const exactLogoLeft = realLogo ? realLogo.getBoundingClientRect().left : (navRect.left + 24);

                    bgPill.style.transition = `top 0.6s ${EASE}, left 0.6s ${EASE}, width 0.6s ${EASE}, height 0.6s ${EASE}, margin 0.6s ${EASE}, border-radius 0.6s ${EASE}`;
                    staticLogo.style.transition = `top 0.6s ${EASE}, left 0.6s ${EASE}, margin 0.6s ${EASE}`;

                    // Move Pill
                    bgPill.style.top = `${targetTop}px`;
                    bgPill.style.left = `${navRect.left}px`;
                    bgPill.style.margin = `-${safeHeight / 2}px 0 0 0`; 
                    bgPill.style.height = `${safeHeight}px`;
                    bgPill.style.width = '200px'; 

                    // Track backing intro blob to navbar position
                    if (introBlob) {
                        introBlob.style.top = `${targetTop}px`;
                        introBlob.style.left = `${navRect.left + (navRect.width / 2)}px`;
                        introBlob.style.margin = '-160px 0 0 -160px';
                    }
                    
                    // Move Logo
                    staticLogo.style.top = `${targetTop}px`;
                    staticLogo.style.left = `${exactLogoLeft}px`;
                    staticLogo.style.margin = `-18px 0 0 0`;

                    // Smoothly unroll the text alongside the logo
                    const logoText = document.getElementById('intro-logo-text');
                    if (logoText) {
                        logoText.style.transition = `width 0.6s ${EASE}, opacity 0.6s ${EASE}`;
                        logoText.style.width = '84px'; // 12px gap + 72px text width
                        logoText.style.opacity = '1';
                    }


                    // Phase 4: Expand pill width to fill navbar
                    setTimeout(() => {
                        bgPill.style.width = `${navRect.width}px`;

                        // Phase 5: Reveal Navigation Items & Cleanup, dissolving intro blob into section ambient glow
                        setTimeout(() => {
                            if (introBlob) {
                                introBlob.style.opacity = '0';
                            }
                            navItems.forEach((item, idx) => {
                                setTimeout(() => {
                                    item.style.opacity = '1';
                                    item.style.transform = 'translateY(0)';
                                }, idx * 75); 
                            });

                            setTimeout(() => {
                                overlay.style.opacity = '0';
                                setTimeout(() => {
                                    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                                    navItems.forEach(item => {
                                        item.style.opacity = '';
                                        item.style.transform = '';
                                        item.style.transition = '';
                                    });
                                }, 750);
                            }, 650);
                        }, 400); 
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