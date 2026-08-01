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
            // Remove any old listeners to prevent duplicates
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            
            newLink.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault(); // Stop CSS/native anchor jumps
                    
                    const navbarCapsule = document.getElementById('navbar-capsule');
                    const offset = navbarCapsule ? navbarCapsule.getBoundingClientRect().height + 24 : 80;
                    
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                    const startPosition = window.pageYOffset;
                    const distance = targetPosition - startPosition;
                    
                    const duration = 800; // 800ms duration for premium feel
                    let startTime = null;
                    
                    // Frame-by-frame GPU animation
                    function animation(currentTime) {
                        if (startTime === null) startTime = currentTime;
                        const timeElapsed = currentTime - startTime;
                        
                        const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
                        window.scrollTo(0, run); // Standard instant scroll to coordinates
                        
                        if (timeElapsed < duration) {
                            requestAnimationFrame(animation);
                        } else {
                            window.scrollTo(0, targetPosition); // Snap to exact pixel at end
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
