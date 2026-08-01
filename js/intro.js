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

    // Start with a tiny 30px ball in the center, only the logo icon perfectly centered
    overlay.innerHTML = `
        <div id="intro-bg-pill" style="position:fixed;top:50%;left:50%;width:30px;height:30px;margin-top:-15px;margin-left:-15px;background:#ffffff;border-radius:9999px;z-index:1;will-change:top, left, width, height, margin; animation: philx-bounce 0.7s cubic-bezier(0.28, 0.84, 0.42, 1) forwards;"></div>
        
        <div id="intro-static-logo" style="position:fixed;top:50%;left:50%;height:36px;margin-top:-18px;margin-left:-18px;z-index:2;opacity:0;will-change:opacity, top, left, margin; display:flex;align-items:center;">
            <img src="assets/logo-mark-black.png" alt="PHILX Logo" style="width:36px;height:36px;object-fit:contain;border-radius:8px;display:block;flex-shrink:0;">
            <div id="intro-logo-text" style="display:flex;align-items:center;opacity:0;overflow:hidden;width:0;will-change:width, opacity;">
                <div style="width:12px;flex-shrink:0;"></div>
                <div style="display:flex;flex-direction:column;justify-content:center;width:72px;flex-shrink:0;">
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

        // Phase 1: Wait for tiny ball to bounce in, then expand to 90px tight circle
        setTimeout(() => {
            bgPill.style.animation = 'none'; // Clear keyframe
            bgPill.style.transition = `width 0.5s ${EASE}, height 0.5s ${EASE}, margin 0.5s ${EASE}`;
            bgPill.style.width = '90px';
            bgPill.style.height = '90px';
            bgPill.style.margin = '-45px 0 0 -45px';


            // Phase 2: Fade in perfectly centered Logo Icon
            setTimeout(() => {
                staticLogo.style.transition = 'opacity 0.4s ease';
                staticLogo.style.opacity = '1';

                // Phase 3: Move to navbar left and morph to short pill
                setTimeout(() => {
                    const navRect = navbarCapsule.getBoundingClientRect();
                    const safeHeight = Math.min(navRect.height, 80); 
                    const targetTop = navRect.top + (safeHeight / 2); 
                    
                    const realLogo = navbarCapsule.querySelector('a') || navbarCapsule.querySelector('img');
                    const exactLogoLeft = realLogo ? realLogo.getBoundingClientRect().left : (navRect.left + 24);

                    bgPill.style.transition = `top 0.6s ${EASE}, left 0.6s ${EASE}, width 0.6s ${EASE}, height 0.6s ${EASE}, margin 0.6s ${EASE}`;
                    staticLogo.style.transition = `top 0.6s ${EASE}, left 0.6s ${EASE}, margin 0.6s ${EASE}`;

                    // Move Pill
                    bgPill.style.top = `${targetTop}px`;
                    bgPill.style.left = `${navRect.left}px`;
                    bgPill.style.margin = `-${safeHeight / 2}px 0 0 0`; 
                    bgPill.style.height = `${safeHeight}px`;
                    bgPill.style.width = '200px'; 
                    
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

                        // Phase 5: Reveal Navigation Items & Cleanup
                        setTimeout(() => {
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