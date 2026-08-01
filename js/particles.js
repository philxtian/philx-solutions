/**
 * PHILX Solutions — Antigravity Monochrome Interactive Canvas & Cursor Spotlight Background
 * Lightweight, 60fps cursor-reactive particle constellation & ambient spotlight animation.
 */

(function () {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-particles-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.95;transition:opacity 0.5s ease;';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Smooth cursor state with lerp
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
    const particles = [];
    const MAX_PARTICLES = 70;
    const CONNECT_DISTANCE = 120;
    const MOUSE_RADIUS = 150;

    let sectionBounds = [];

    function updateSectionBounds() {
        sectionBounds = Array.from(document.querySelectorAll('[data-section-theme]')).map(el => {
            const rect = el.getBoundingClientRect();
            return {
                top: rect.top + window.scrollY,
                bottom: rect.bottom + window.scrollY,
                theme: el.getAttribute('data-section-theme')
            };
        });
    }

    function getThemeAtY(screenY) {
        const pageY = screenY + window.scrollY;
        for (let i = 0; i < sectionBounds.length; i++) {
            const s = sectionBounds[i];
            if (pageY >= s.top && pageY <= s.bottom) {
                return s.theme;
            }
        }
        return 'dark';
    }

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        updateSectionBounds();
        initParticles();
    }

    function Particle(x, y) {
        this.x = x || Math.random() * width;
        this.y = y || Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.baseRadius = Math.random() * 1.6 + 1.2;
        this.radius = this.baseRadius;
    }

    Particle.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off screen boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Cursor attraction / gentle displacement
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < MOUSE_RADIUS && dist > 0) {
            const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 1.4;
            this.y -= Math.sin(angle) * force * 1.4;
            this.radius = this.baseRadius + force * 2.2;
        } else {
            this.radius += (this.baseRadius - this.radius) * 0.05;
        }
    };

    function initParticles() {
        particles.length = 0;
        const count = Math.min(Math.floor((width * height) / 16000), MAX_PARTICLES);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        // Smooth cursor lerping
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;

        ctx.clearRect(0, 0, width, height);

        // Draw subtle monochrome cursor spotlight gradient
        if (mouse.x > 0 && mouse.y > 0) {
            const cursorTheme = getThemeAtY(mouse.y);
            const isCursorLight = cursorTheme === 'light';
            const spotBaseColor = isCursorLight ? '0, 0, 0' : '255, 255, 255';
            const spotAlpha = isCursorLight ? 0.06 : 0.08;

            const spotGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 250);
            spotGrad.addColorStop(0, `rgba(${spotBaseColor}, ${spotAlpha})`);
            spotGrad.addColorStop(1, `rgba(${spotBaseColor}, 0)`);
            ctx.fillStyle = spotGrad;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 250, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw connecting constellation lines & particles
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.update();

            const theme1 = getThemeAtY(p1.y);
            const isLight1 = theme1 === 'light';
            const baseColor1 = isLight1 ? '0, 0, 0' : '255, 255, 255';
            const lineAlphaMax1 = isLight1 ? 0.12 : 0.1;

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.hypot(dx, dy);

                if (dist < CONNECT_DISTANCE) {
                    const alpha = (1 - dist / CONNECT_DISTANCE) * lineAlphaMax1;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(${baseColor1}, ${alpha})`;
                    ctx.lineWidth = 0.85;
                    ctx.stroke();
                }
            }

            // Draw line to cursor if close
            const mouseDist = Math.hypot(mouse.x - p1.x, mouse.y - p1.y);
            if (mouseDist < MOUSE_RADIUS) {
                const mouseAlpha = (1 - mouseDist / MOUSE_RADIUS) * (isLight1 ? 0.28 : 0.25);
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(${baseColor1}, ${mouseAlpha})`;
                ctx.lineWidth = 1.1;
                ctx.stroke();
            }

            // Draw Particle Dot
            ctx.beginPath();
            ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
            const particleAlphaBase = isLight1 ? 0.35 : 0.3;
            const dotAlpha = mouseDist < MOUSE_RADIUS ? particleAlphaBase * 2.2 : particleAlphaBase;
            ctx.fillStyle = `rgba(${baseColor1}, ${dotAlpha})`;
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    // Global Mouse Event Listeners
    window.addEventListener('mousemove', function (e) {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', function () {
        mouse.targetX = -1000;
        mouse.targetY = -1000;
    }, { passive: true });

    window.addEventListener('scroll', function () {
        updateSectionBounds();
    }, { passive: true });

    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 100);
    }, { passive: true });

    // Initialize
    resize();
    animate();
})();
