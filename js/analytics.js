/**
 * PHILX Solutions — Dynamic Google Analytics Injector
 * Fetches the GA Measurement ID from the serverless config endpoint
 * to keep the static frontend architecture clean while supporting dynamic environments.
 */

async function initAnalytics() {
    try {
        const response = await fetch('/api/config');
        if (!response.ok) return;
        
        const data = await response.json();
        const gaId = data.gaId;

        if (gaId && gaId.startsWith('G-')) {
            // Inject Google Tag Manager Script
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
            document.head.appendChild(script);

            // Initialize dataLayer
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', gaId);
            
            console.log(`[Analytics] Initialized with ID: ${gaId}`);
        } else {
            console.warn('[Analytics] GA Measurement ID not found or invalid format.');
        }
    } catch (err) {
        console.error('[Analytics] Failed to load configuration:', err);
    }
}

// Initialize as soon as possible without blocking render
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
} else {
    initAnalytics();
}
