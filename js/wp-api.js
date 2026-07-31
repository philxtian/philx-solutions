/**
 * PHILX Solutions — Headless WordPress REST API, HTMX & Theme Bridge
 * Asynchronous REST API integration for contact form submissions, Lofi editorial layout helpers & dynamic CMS data handling.
 * Strict High-End Monochrome Design System.
 */

window.PHILX_WP_CONFIG = {
    // Base URL for Headless WordPress CMS (e.g. "https://cms.philxsolutions.com")
    wpApiBaseUrl: localStorage.getItem('philx_wp_api_url') || "",
    contactEndpoint: "/wp-json/wp/v2/contact",
    servicesEndpoint: "/wp-json/wp/v2/services",
    isLiveWpActive: false,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
};

/**
 * Minimalist One-Click Copy-to-Clipboard Utility (Lofi interaction inspired)
 */
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
        el.classList.add('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black');
        setTimeout(() => {
            label.textContent = originalText;
            el.classList.remove('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black');
        }, 2000);
    }
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

// Mobile Menu Toggle Function
window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;
    menu.classList.toggle('hidden');
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

// Global Event Delegation for Smooth Anchor Link Navigation
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

/**
 * Headless WordPress REST API & Contact Form Submission Manager
 */
window.PHILX_WP_API = {

    /**
     * Handle Contact Form Submit asynchronously with WP REST API support
     */
    async handleContactSubmit(evt) {
        const form = evt.target.closest('form');
        if (!form) return;

        const config = window.PHILX_WP_CONFIG;
        const responseContainer = document.getElementById('form-response');
        const submitBtn = document.getElementById('submit-btn') || form.querySelector('button[type="submit"]');
        const btnSpinner = document.getElementById('btn-spinner');
        const btnText = document.getElementById('btn-text');

        if (config.wpApiBaseUrl && config.wpApiBaseUrl.trim() !== "") {
            evt.preventDefault();

            this.setLoadingState(submitBtn, btnSpinner, btnText, true);

            const formData = new FormData(form);
            const payload = {
                name: formData.get('name'),
                email: formData.get('email'),
                organization: formData.get('organization'),
                service: formData.get('service'),
                message: formData.get('message'),
                submitted_at: new Date().toISOString()
            };

            const endpointUrl = `${config.wpApiBaseUrl.replace(/\/$/, '')}${config.contactEndpoint}`;

            try {
                const response = await fetch(endpointUrl, {
                    method: 'POST',
                    headers: config.headers,
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const successHtml = await fetch('api/contact-success.html').then(res => res.text());
                    if (responseContainer) {
                        responseContainer.innerHTML = successHtml;
                    }
                    form.reset();
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    const errMsg = errorData.message || `WordPress API returned status ${response.status}`;
                    this.renderErrorMessage(responseContainer, errMsg);
                }
            } catch (err) {
                console.warn('WP REST API endpoint unreachable, falling back to static success layer:', err);
                const successHtml = await fetch('api/contact-success.html').then(res => res.text()).catch(() => 
                    `<div class="p-4 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-black/10 dark:border-white/20 text-slate-900 dark:text-white text-sm">Lead inquiry received. Thank you!</div>`
                );
                if (responseContainer) responseContainer.innerHTML = successHtml;
                form.reset();
            } finally {
                this.setLoadingState(submitBtn, btnSpinner, btnText, false);
            }
        }
    },

    setLoadingState(btn, spinner, textEl, isLoading) {
        if (!btn) return;
        btn.disabled = isLoading;
        if (isLoading) {
            btn.classList.add('opacity-75', 'cursor-not-allowed');
            if (spinner) spinner.classList.remove('hidden');
            if (textEl) textEl.textContent = 'Submitting Inquiry...';
        } else {
            btn.classList.remove('opacity-75', 'cursor-not-allowed');
            if (spinner) spinner.classList.add('hidden');
            if (textEl) textEl.innerHTML = 'Submit Lead Inquiry &rarr;';
        }
    },

    renderErrorMessage(container, msg) {
        if (!container) return;
        container.innerHTML = `
            <div class="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-start space-x-3 transition-all duration-300">
                <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                    <p class="font-bold">Submission Notice</p>
                    <p class="text-xs mt-0.5 opacity-90">${msg}</p>
                </div>
            </div>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    updateThemeIcons();
});

document.body.addEventListener('htmx:afterSwap', function (evt) {
    updateThemeIcons();
});

/**
 * HTMX Event Hooks: CORS Header configuration & Form submit indicators
 */
document.body.addEventListener('htmx:configRequest', function (evt) {
    const config = window.PHILX_WP_CONFIG;
    if (config.wpApiBaseUrl && evt.detail.path.includes(config.wpApiBaseUrl)) {
        evt.detail.headers['Content-Type'] = 'application/json';
        evt.detail.headers['Accept'] = 'application/json';
    }
});

document.body.addEventListener('htmx:beforeRequest', function (evt) {
    if (evt.detail.elt && evt.detail.elt.id === 'contact-form') {
        const btn = document.getElementById('submit-btn');
        const spinner = document.getElementById('btn-spinner');
        const textEl = document.getElementById('btn-text');
        window.PHILX_WP_API.setLoadingState(btn, spinner, textEl, true);
    }
});

document.body.addEventListener('htmx:afterRequest', function (evt) {
    if (evt.detail.elt && evt.detail.elt.id === 'contact-form') {
        const btn = document.getElementById('submit-btn');
        const spinner = document.getElementById('btn-spinner');
        const textEl = document.getElementById('btn-text');
        window.PHILX_WP_API.setLoadingState(btn, spinner, textEl, false);
        
        if (evt.detail.successful) {
            evt.detail.elt.reset();
        }
    }
});

/**
 * HTMX Event Hook: Intercepts JSON responses from WordPress REST API / services.json
 * and converts JSON data into Strict Monochrome Editorial Case Study Cards.
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
                    const category = item.category || 'Engineering Capabilities';
                    const description = item.excerpt?.rendered || item.description || item.content || '';
                    const tags = item.tags || ['Tailwind CSS', 'WordPress REST', 'HTMX'];
                    const metric = item.metric || 'Enterprise Ready';
                    const image = item.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';

                    const tagsHtml = tags.map(tag => `<span class="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-slate-100 dark:bg-zinc-900 border border-black/10 dark:border-white/15 rounded-md text-slate-700 dark:text-zinc-300">${tag}</span>`).join(' ');

                    return `
                        <div class="group relative">
                            <div class="p-7 rounded-2xl bg-white dark:bg-black border border-black/10 dark:border-white/15 flex flex-col justify-between h-full shadow-lg dark:shadow-none transition-all duration-500 hover:border-black/30 dark:hover:border-white/40 group-hover:-translate-y-1 relative z-10 overflow-hidden">
                                <div>
                                    <div class="flex items-center justify-between mb-4">
                                        <span class="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-widest">${number} // ${category}</span>
                                        <span class="px-2.5 py-0.5 text-[9px] font-bold uppercase rounded-full bg-slate-100 dark:bg-zinc-900 border border-black/10 dark:border-white/20 text-slate-800 dark:text-zinc-200">${metric}</span>
                                    </div>

                                    <div class="overflow-hidden rounded-xl border border-black/10 dark:border-white/15 mb-6 h-44 relative bg-slate-900">
                                        <img src="${image}" alt="${title}" loading="lazy" class="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 transition-all duration-700">
                                    </div>

                                    <h3 class="text-xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-slate-600 dark:group-hover:text-zinc-300 transition-colors">${title}</h3>
                                    <p class="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed font-normal mb-6">${description}</p>
                                </div>

                                <div class="pt-4 border-t border-black/5 dark:border-white/10 flex flex-col space-y-4">
                                    <div class="flex flex-wrap gap-1.5">${tagsHtml}</div>
                                    <a href="#contact" class="inline-flex items-center text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white hover:text-slate-600 dark:hover:text-zinc-400 group-hover:translate-x-1 transition-transform">
                                        Explore Solution &rarr;
                                    </a>
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
