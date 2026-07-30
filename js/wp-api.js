/**
 * PHILX Solutions — Headless WordPress REST API & HTMX Bridge
 * Handles dynamic content fetching from WordPress endpoints (e.g. /wp-json/wp/v2/services)
 * and transforms JSON responses into strict Monochromatic Black & White Tailwind CSS components.
 */

window.PHILX_WP_CONFIG = {
    wpApiBaseUrl: "", 
    isLiveWpActive: false
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('PHILX Solutions WP + HTMX Bridge initialized with Monochromatic Black & White aesthetic.');
});

/**
 * HTMX Event Hook: Intercepts JSON responses from WordPress REST API
 * and converts JSON data into Black & White cards before HTMX swaps into DOM.
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
                        <div class="p-8 rounded-2xl bg-black border border-white/20 flex flex-col justify-between h-full group hover:border-white transition-all duration-200">
                            <div>
                                <div class="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center font-extrabold text-lg mb-8">
                                    ${number}
                                </div>
                                <h3 class="text-xl font-bold text-white mb-4 tracking-tight">${title}</h3>
                                <div class="text-zinc-400 text-sm leading-relaxed font-normal">${description}</div>
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
