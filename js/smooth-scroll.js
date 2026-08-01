(function() {
    'use strict';
    
    // Forcibly neutralize native CSS smooth scrolling to prevent Safari engine conflicts
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Smooth easing math (easeInOutCubic)
    function easeInOutCubic(t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t*t + b;
        t -= 2;
        return c/2*(t*t*t + 2) + b;
    }

    let isScrolling = false; 

    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            if (link.dataset.scrollBound === 'true') return;
            link.dataset.scrollBound = 'true';
            
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault(); 
                    
                    if (isScrolling) return; 
                    isScrolling = true;
                    
                    // Calculate layout instantly, start animation on the precise next frame
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                    const startPosition = window.scrollY;
                    const distance = targetPosition - startPosition;
                    
                    if (distance === 0) {
                        isScrolling = false;
                        return;
                    }

                    const duration = 800; 
                    let startTime = null;
                    
                    function animation(currentTime) {
                        if (startTime === null) startTime = currentTime; // High-res DOMHighResTimeStamp
                        const timeElapsed = currentTime - startTime;
                        
                        const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
                        window.scrollTo(0, run); 
                        
                        if (timeElapsed < duration) {
                            requestAnimationFrame(animation);
                        } else {
                            window.scrollTo(0, targetPosition); 
                            isScrolling = false; 
                        }
                    }
                    
                    requestAnimationFrame(animation);
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSmoothScroll);
    } else {
        initSmoothScroll();
    }
    
    document.body.addEventListener('htmx:afterSwap', initSmoothScroll);
})();
