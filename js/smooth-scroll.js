(function() {
    'use strict';
    
    function initSmoothScroll() {
        // Find all anchor links that point to a section on the same page (e.g., href="#services")
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                // Ignore empty links or just "#" 
                if (!targetId || targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault(); // Stop Safari's delayed native CSS anchor jump
                    
                    // Get the navbar height to offset the scroll so it doesn't cover section headers
                    const navbarCapsule = document.getElementById('navbar-capsule');
                    const offset = navbarCapsule ? navbarCapsule.getBoundingClientRect().height + 24 : 80;
                    
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    
                    // Force an instant, hardware-accelerated JS smooth scroll
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Run when DOM is ready or after HTMX swaps
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSmoothScroll);
    } else {
        initSmoothScroll();
    }
    
    if (document.body) {
        document.body.addEventListener('htmx:afterSwap', initSmoothScroll);
    }
})();
