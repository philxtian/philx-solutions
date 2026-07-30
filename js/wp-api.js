/**
 * PHILX Solutions — Headless WordPress REST API, HTMX & Theme Bridge
 * Handles dynamic content fetching from WordPress endpoints (e.g. /wp-json/wp/v2/services)
 * and controls Dark/Light mode theme switching with localStorage persistence.
 */

window.PHILX_WP_CONFIG = {
    wpApiBaseUrl: "", 
    isLiveWpActive: false
};

// Global Theme Toggle Function
window.toggleTheme = function() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
    updateThemeIcons();
};

function updateThemeIcons() {
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    if (!lightIcon || !darkIcon) return;

    if (document.documentElement.classList.contains('dark')) {
        lightIcon.classList.remove('hidden');
        darkIcon.classList.add('hidden');
    } else {
        lightIcon.classList.add('hidden');
        darkIcon.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateThemeIcons();
});

document.body.addEventListener('htmx:afterSwap', function (evt) {
    updateThemeIcons();
});

/**
 * HTMX Event Hook: Intercepts JSON responses from WordPress REST API
 * and converts JSON data into Opaque Cards with Outer Aurora Glow Wrappers.
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
                        <div class="aurora-wrapper group relative">
                            <div class="aurora-glow absolute -inset-2.5 rounded-3xl bg-gradient-to-r from-pink-500 via-blue-500 via-purple-500 to-amber-500 opacity-0 blur-xl group-hover:opacity-35 transition-opacity duration-500 pointer-events-none -z-10"></div>
                            <div class="aurora-border absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-pink-500 via-blue-500 via-purple-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10"></div>
                            
                            <div class="p-8 rounded-2xl bg-white dark:bg-black border border-black/10 dark:border-white/15 flex flex-col justify-between h-full shadow-lg dark:shadow-none transition-transform duration-500 group-hover:-translate-y-1 relative z-10">
                                <div>
                                    <div class="w-12 h-12 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-extrabold text-lg mb-8 shadow-md">
                                        ${number}
                                    </div>
                                    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">${title}</h3>
                                    <div class="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed font-normal">${description}</div>
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
