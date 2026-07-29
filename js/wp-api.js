/**
 * PHILX Solutions — Headless WordPress REST API & HTMX Bridge
 * Handles dynamic content fetching from WordPress endpoints (e.g. /wp-json/wp/v2/services)
 * and transforms JSON responses into Tailwind-styled HTML components.
 */

window.PHILX_WP_CONFIG = {
    // Replace with live Headless WordPress URL when available, e.g. "https://cms.philx.solutions"
    wpApiBaseUrl: "", 
    isLiveWpActive: false
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('PHILX Solutions WP + HTMX Bridge initialized.');
});

/**
 * HTMX Event Hook: Intercepts JSON responses from WordPress REST API
 * and converts JSON data into Tailwind CSS cards before HTMX swaps into DOM.
 */
document.body.addEventListener('htmx:beforeSwap', function (evt) {
    // Intercept services JSON endpoint response
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
                        <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full hover:border-blue-600/50 transition-all duration-300 group">
                            <div>
                                <div class="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    ${number}
                                </div>
                                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">${title}</h3>
                                <div class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">${description}</div>
                            </div>
                        </div>
                    `;
                }).join('');

                evt.detail.serverResponse = htmlContent;
            }
        } catch (e) {
            // Not a JSON response or already HTML, allow standard swap
        }
    }
});
