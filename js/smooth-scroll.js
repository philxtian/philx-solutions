(function() {
    'use strict';
    
    // Smooth easing math (easeInOutCubic)
    function easeInOutCubic(t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t*t + b;
        t -= 2;
        return c/2*(t*t*t + 2) + b;
    }

    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            // Safely prevent duplicate listeners without destroying the DOM node
            if (link.dataset.scrollBound === 'true') return;
            link.dataset.scrollBound = 'true';
            
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault(); 
                    
                    const navbarCapsule = document.getElementById('navbar-capsule');
                    const offset = navbarCapsule ? navbarCapsule.getBoundingClientRect().height + 24 : 80;
                    
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                    const startPosition = window.pageYOffset;
                    const distance = targetPosition - startPosition;
                    
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
    
    if (document.body) {
        document.body.addEventListener('htmx:afterSwap', initSmoothScroll);
    }
})();
