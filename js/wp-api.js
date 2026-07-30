/**
 * PHILX Solutions — Headless WordPress REST API & HTMX Bridge
 * Handles dynamic content fetching from WordPress endpoints (e.g. /wp-json/wp/v2/services)
 * and transforms JSON responses into Antigravity/Apple inspired Tailwind CSS components.
 */

window.PHILX_WP_CONFIG = {
    wpApiBaseUrl: "", 
    isLiveWpActive: false
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('PHILX Solutions WP + HTMX Bridge initialized with Antigravity/Apple hybrid aesthetic.');
});

/**
 * HTMX Event Hook: Intercepts JSON responses from WordPress REST API
 * and converts JSON data into frosted glass cards before HTMX swaps into DOM.
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
                    const description = item.excerpt?.rendered || item.description || item.content || '';

                    return `
                        <div class="p-8 rounded-3xl bg-[#16161C]/80 border border-white/10 backdrop-blur-xl flex flex-col justify-between h-full group hover:border-blue-500/50 hover:shadow-[0_0_40px_-10px_rgba(37,99,235,0.3)] transition-all duration-300">
                            <div>
                                <div class="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-extrabold text-lg mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    ${number}
                                </div>
                                <h3 class="text-xl font-bold text-white mb-3 tracking-tight">${title}</h3>
                                <div class="text-slate-400 text-sm leading-relaxed font-normal">${description}</div>
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
