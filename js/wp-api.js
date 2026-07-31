/**
 * PHILX Solutions — Enterprise REST API & Theme Bridge
 * Asynchronous REST API integration for contact form submissions & dynamic data handling.
 * Minimalist Rounded Boxes & Alternating Black-and-White Architecture.
 */

window.PHILX_WP_CONFIG = {
    wpApiBaseUrl: localStorage.getItem('philx_wp_api_url') || "",
    contactEndpoint: "/wp-json/wp/v2/contact",
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
        el.classList.add('bg-black', 'text-white');
        setTimeout(() => {
            label.textContent = originalText;
            el.classList.remove('bg-black', 'text-white');
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

window.PHILX_WP_API = {
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
                    const errMsg = errorData.message || `REST API returned status ${response.status}`;
                    this.renderErrorMessage(responseContainer, errMsg);
                }
            } catch (err) {
                console.warn('REST API endpoint unreachable, falling back to static success layer:', err);
                const successHtml = await fetch('api/contact-success.html').then(res => res.text()).catch(() => 
                    `<div class="p-4 rounded-xl bg-zinc-900 border border-white/20 text-white text-sm">Lead inquiry received. Thank you!</div>`
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
            <div class="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start space-x-3 transition-all duration-300">
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
                        <div class="group rounded-3xl border border-black/15 bg-slate-50/70 p-8 sm:p-10 transition-all duration-300 hover:border-black/40 hover:bg-slate-100/80">
                            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
                                <div class="md:col-span-3 flex items-center justify-between md:flex-col md:items-start space-y-1">
                                    <span class="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">${number} // ${category}</span>
                                    <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400">${metric}</span>
                                </div>
                                <div class="md:col-span-6">
                                    <h3 class="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:opacity-75 transition-opacity">${title}</h3>
                                    <p class="mt-3 text-slate-600 text-sm leading-relaxed font-normal">${description}</p>
                                </div>
                                <div class="md:col-span-3 md:text-right">
                                    <a href="#contact" class="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-900 hover:opacity-60 transition-opacity">
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
