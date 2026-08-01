(function() {
    'use strict';
    
    // Smooth easing math (easeInOutCubic)
    function easeInOutCubic(t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t*t + b;
        t -= 2;
        return c/2*(t*t*t + 2) + b;
    }

    let isScrolling = false; // Global lock to prevent overlapping calculations

    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            if (link.dataset.scrollBound === 'true') return;
            link.dataset.scrollBound = 'true';
            
            const triggerScroll = function(e) {
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault(); 
                    
                    if (isScrolling) return; // Ignore secondary events if already moving
                    isScrolling = true;
                    
                    const offset = 0; 
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                    const startPosition = window.pageYOffset;
                    const distance = targetPosition - startPosition;
                    
                    // If we are already at the target, unlock and exit
                    if (distance === 0) {
                        isScrolling = false;
                        return;
                    }

                    const duration = 800; 
                    let startTime = null;
                    
                    function animation(currentTime) {
                        if (startTime === null) startTime = currentTime;
                        const timeElapsed = currentTime - startTime;
                        
                        const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
                        window.scrollTo(0, run); 
                        
                        if (timeElapsed < duration) {
                            requestAnimationFrame(animation);
                        } else {
                            window.scrollTo(0, targetPosition); 
                            isScrolling = false; // Release lock when finished
                        }
                    }
                    
                    requestAnimationFrame(animation);
                }
            };

            // Bind to instant touch/pointer events, with click as a fallback
            link.addEventListener('click', triggerScroll);
            link.addEventListener('touchstart', triggerScroll, { passive: false });
            link.addEventListener('pointerdown', triggerScroll);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSmoothScroll);
    } else {
        initSmoothScroll();
    }
    
    document.body.addEventListener('htmx:afterSwap', initSmoothScroll);
})();
