/**
 * PHILX Solutions — 2026 Bouncing Ball Approach & Center-to-Left Pill Reveal
 */
(function () {
    'use strict';
    
    if (window.PHILX_INTRO_ACTIVE) return;
    window.PHILX_INTRO_ACTIVE = true;

    const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
    const LOGO_EASE = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
    
    // Inject Custom Keyframes for the Bouncing Approach
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes ball-approach-bounce {
            0% { transform: scale(0) translateY(0); }
            15% { transform: scale(0.1) translateY(-60px); }
            30% { transform: scale(0.15) translateY(0); }
            45% { transform: scale(0.25) translateY(-30px); }
            60% { transform: scale(0.35) translateY(0); }
            75% { transform: scale(1.15) translateY(0); }
            85% { transform: scale(0.95) translateY(0); }
            100% { transform: scale(1) translateY(0); }
        }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'intro-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:#000000;z-index:99999;pointer-events:none;transition:opacity 0.75s ease;';

    overlay.innerHTML = `
        <div id="intro-bg-pill" style="position:fixed;top:50%;left:50%;width:150px;height:150px;margin-top:-75px;margin-left:-75px;background:#ffffff;border-radius:9999px;z-index:1;will-change:top, left, width, height, transform, margin; animation: ball-approach-bounce 1.3s cubic-bezier(0.28, 0.84, 0.42, 1) forwards;"></div>
        
        <div id="intro-static-logo" style="position:fixed;top:50%;left:50%;margin-top:-18px;margin-left:-54px;z-index:2;opacity:0;transform:scale(0.5);will-change:opacity, transform, top, left, margin; transition: opacity 0.4s ease, transform 0.4s ${LOGO_EASE}; display:flex;align-items:center;">
            <div style="display:flex;align-items:center;" class="space-x-3">
                <img src="assets/logo-mark-black.png" alt="PHILX Logo" style="width:36px;height:36px;object-fit:contain;border-radius:8px;display:block;">
                <div style="display:flex;flex-direction:column;justify-content:center;width:72px;">
                    <div style="display:flex;justify-content:space-between;font-weight:900;color:#000000;line-height:1;font-size:13px;text-transform:uppercase;">
                        <span>P</span><span>H</span><span>I</span><span>L</span><span>X</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:9px;font-weight:700;color:#64748b;line-height:1;margin-top:4px;text-transform:uppercase;">
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

        // Phase 1: Reveal logo inside circle right as the ball finishes its 3D bouncing approach (~1100ms)
        setTimeout(() => {
            staticLogo.style.opacity = '1';
            staticLogo.style.transform = 'scale(1)';

            // Phase 2: Move to navbar left and morph to short pill (~1800ms total)
            setTimeout(() => {
                // Clear keyframe animation lock and set smooth transitions for left glide
                bgPill.style.animation = 'none';
                bgPill.style.transform = 'scale(1)';

                bgPill.style.transition = `top 0.6s ${EASE}, left 0.6s ${EASE}, width 0.6s ${EASE}, height 0.6s ${EASE}, margin 0.6s ${EASE}`;
                staticLogo.style.transition = `top 0.6s ${EASE}, left 0.6s ${EASE}, margin 0.6s ${EASE}`;

                // Measure dynamically AFTER layout has settled
                const navRect = navbarCapsule.getBoundingClientRect();
                const safeHeight = Math.min(navRect.height, 80); // Failsafe limit
                const targetTop = navRect.top + (safeHeight / 2); // Center Y of navbar
                
                // Dynamically find the real logo to match its exact X coordinate
                const realLogo = navbarCapsule.querySelector('a') || navbarCapsule.querySelector('img');
                const exactLogoLeft = realLogo ? realLogo.getBoundingClientRect().left : (navRect.left + 24);

                // Move Pill
                bgPill.style.top = `${targetTop}px`;
                bgPill.style.left = `${navRect.left}px`;
                bgPill.style.margin = `-${safeHeight / 2}px 0 0 0`; // Reset left margin, anchor to left
                bgPill.style.height = `${safeHeight}px`;
                bgPill.style.width = '200px'; 
                
                // Move Logo EXACTLY to the real logo's left coordinate
                staticLogo.style.top = `${targetTop}px`;
                staticLogo.style.left = `${exactLogoLeft}px`;
                staticLogo.style.margin = `-18px 0 0 0`; // Anchor cleanly

                // Phase 3: Expand pill width to fill navbar
                setTimeout(() => {
                    bgPill.style.width = `${navRect.width}px`;

                    // Phase 4: Reveal Navigation Items
                    setTimeout(() => {
                        const navItems = navbarCapsule.querySelectorAll('.nav-link, .nav-cta, .nav-mobile-btn');
                        navItems.forEach((item, idx) => {
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, idx * 75); 
                        });

                        // Phase 5: Fade overlay and cleanup
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
            }, 700); 

        }, 1100);
    }

    function init() {
        if (document.getElementById('navbar-capsule')) runSequence();
        else {
            document.body.addEventListener('htmx:afterSwap', function (evt) {
                if (evt.detail.target.id === 'navbar-container' || document.getElementById('navbar-capsule')) {
                    runSequence();
                }
            }, { once: true });
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();