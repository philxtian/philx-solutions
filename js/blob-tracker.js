(function() {
    'use strict';
    let targetX = 0, targetY = 0;
    let trackedBlobs = [];

    function updateBlobs() {
        const elements = document.querySelectorAll('.blob-forward, .blob-reverse, .blob-slow, .blob-medium, .blob-fast');
        trackedBlobs = Array.from(elements).map((el, index) => {
            let lerpSpeed = 0.03 + (index % 5) * 0.025; // Organic variation between 0.03 and 0.13
            let weight = 0.6 + (index % 4) * 0.3;       // Staggered motion displacement weight
            let isReverse = el.classList.contains('blob-reverse');

            if (el.classList.contains('blob-slow')) {
                lerpSpeed = 0.03 + (index % 3) * 0.01;
                weight = 0.65;
            } else if (el.classList.contains('blob-medium')) {
                lerpSpeed = 0.07 + (index % 3) * 0.015;
                weight = 1.1;
            } else if (el.classList.contains('blob-fast')) {
                lerpSpeed = 0.11 + (index % 3) * 0.02;
                weight = 1.65;
            }

            if (el.dataset.speed) lerpSpeed = parseFloat(el.dataset.speed);
            if (el.dataset.weight) weight = parseFloat(el.dataset.weight);

            if (isReverse && !el.dataset.weight) weight *= -1;

            return {
                el,
                cx: 0,
                cy: 0,
                lerpSpeed,
                weight
            };
        });
    }

    document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 380; 
        targetY = (e.clientY / window.innerHeight - 0.5) * 380;
    });

    function render() {
        trackedBlobs.forEach(b => {
            const tx = targetX * b.weight;
            const ty = targetY * b.weight;
            b.cx += (tx - b.cx) * b.lerpSpeed;
            b.cy += (ty - b.cy) * b.lerpSpeed;
            b.el.style.transform = `translate3d(${b.cx.toFixed(2)}px, ${b.cy.toFixed(2)}px, 0)`;
        });

        requestAnimationFrame(render);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            updateBlobs();
            requestAnimationFrame(render);
        });
    } else {
        updateBlobs();
        requestAnimationFrame(render);
    }

    document.body.addEventListener('htmx:afterSwap', updateBlobs);
})();
