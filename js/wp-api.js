/**
 * PHILX Solutions — Theme Utility Bridge
 * Clipboard copy, mobile menu, smooth-scroll, and the services HTMX transformer.
 * Minimalist Rounded Boxes & Alternating Black-and-White Architecture.
 */

window.PHILX_WP_CONFIG = {
    wpApiBaseUrl: localStorage.getItem('philx_wp_api_url') || "",
    servicesEndpoint: "/wp-json/wp/v2/services",
    isLiveWpActive: false,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
};

window.copyToClipboard = function(text, el) {
    if (!navigator.clipboard) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    } else {
        navigator.clipboard.writeText(text);
    }
    
    if (el) {
        const label = el.querySelector('.copy-label') || el;
        const originalText = label.textContent;
        label.textContent = 'Copied to Clipboard!';
        el.classList.add('bg-white/20');
        setTimeout(() => {
            label.textContent = originalText;
            el.classList.remove('bg-white/20');
        }, 2000);
    }
};

window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;
    menu.classList.toggle('hidden');
};

document.addEventListener('click', function (evt) {
    const targetLink = evt.target.closest('a[href^="#"]');
    if (!targetLink) return;

    const targetId = targetLink.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        evt.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    }
});

document.body.addEventListener('htmx:configRequest', function (evt) {
    const config = window.PHILX_WP_CONFIG;
    if (config.wpApiBaseUrl && evt.detail.path.includes(config.wpApiBaseUrl)) {
        evt.detail.headers['Content-Type'] = 'application/json';
        evt.detail.headers['Accept'] = 'application/json';
    }
});

/**
 * Event Hook: Transforms services JSON into Minimalist Rounded Container Boxes.
 */
document.body.addEventListener('htmx:beforeSwap', function (evt) {
    if (evt.detail.xhr.responseURL.includes('services') || evt.detail.target.id === 'services-grid') {
        try {
            const rawResponse = evt.detail.xhr.responseText;
            const servicesData = JSON.parse(rawResponse);
            
            if (Array.isArray(servicesData)) {
                const htmlContent = servicesData.map((item, index) => {
                    const number = (index + 1).toString().padStart(2, '0');
                    const title = item.title?.rendered || item.title || 'Service Title';
                    const category = item.category || 'Capabilities';
                    const description = item.excerpt?.rendered || item.description || item.content || '';
                    const metric = item.metric || 'Enterprise Ready';

                    return `
                        <div class="group relative bg-white/[0.4] backdrop-blur-3xl border border-white/[0.6] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-3xl overflow-hidden p-8 sm:p-10 transition-all duration-500 ease-out hover:bg-white/[0.65] hover:-translate-y-1 hover:shadow-[0_16px_40px_0_rgba(31,38,135,0.15)] reveal-hidden">
                            <div class="card-spotlight absolute inset-0 pointer-events-none z-0"></div>
                            <div class="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
                                <div class="md:col-span-4 flex items-center justify-between md:flex-col md:items-start space-y-1">
                                    <span class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">${category}</span>
                                    <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400">${metric}</span>
                                </div>
                                <div class="md:col-span-8">
                                    <h3 class="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:opacity-75 transition-opacity">${title}</h3>
                                    <p class="mt-3 text-slate-600 text-sm leading-relaxed font-normal">${description}</p>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');

                evt.detail.serverResponse = htmlContent;
            }
        } catch (e) {
            // Standard HTML fallback
        }
    }
});
