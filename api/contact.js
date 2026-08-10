function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    res.setHeader('Access-Control-Allow-Origin', 'https://philxsolutions.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Invalid or missing request body.' });
        }

        const { 'cf-turnstile-response': token, name, email, company, solution, message } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Security validation missing' });
        }

        // Server-side validation (defense-in-depth against bypassed client-side checks)
        const errors = [];
        if (typeof name !== 'string' || name.trim().length === 0) errors.push('Name is required.');
        else if (name.length > 200) errors.push('Name must be under 200 characters.');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof email !== 'string' || email.trim().length === 0) errors.push('Email is required.');
        else if (!emailRegex.test(email)) errors.push('Please provide a valid email address.');
        else if (email.length > 200) errors.push('Email must be under 200 characters.');

        if (typeof message !== 'string' || message.trim().length === 0) errors.push('Message is required.');
        else if (message.length > 5000) errors.push('Message must be under 5000 characters.');

        if (typeof company === 'string' && company.length > 200) errors.push('Company must be under 200 characters.');
        if (typeof solution === 'string' && solution.length > 200) errors.push('Solution area must be under 200 characters.');

        if (errors.length > 0) {
            return res.status(400).json({ error: errors[0], errors });
        }

        // 1. Verify Turnstile Token with Cloudflare
        const cfRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${process.env.CLOUDFLARE_SECRET_KEY}&response=${token}`
        });
        const cfData = await cfRes.json();

        if (!cfData.success) {
            return res.status(403).json({ error: 'Security verification failed. Please try again.' });
        }

        // 2. Send Email via Resend REST API
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            console.error('RESEND_API_KEY is not set.');
            return res.status(500).json({ error: 'Server misconfiguration. Please try again later or contact us directly.' });
        }

        const emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2 style="color: #000;">New Consultation Request</h2>
                <p><strong>Name:</strong> ${escapeHtml(name) || 'N/A'}</p>
                <p><strong>Email:</strong> ${escapeHtml(email) || 'N/A'}</p>
                <p><strong>Company:</strong> ${escapeHtml(company) || 'N/A'}</p>
                <p><strong>Solution Area:</strong> ${escapeHtml(solution) || 'N/A'}</p>
                <br/>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${escapeHtml(message) || 'N/A'}</p>
            </div>
        `;

        const emailRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: process.env.RESEND_FROM_EMAIL || 'PHILX Solutions <notifications@philxsolutions.com>',
                to: 'info@philxsolutions.com',
                subject: `New Consultation Request from ${escapeHtml(name) || 'Website User'}`,
                html: emailHtml
            })
        });

        if (!emailRes.ok) {
            const errorText = await emailRes.text();
            console.error('Resend Error:', errorText);
            return res.status(500).json({ error: 'Failed to dispatch email. Please try again later.' });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('API Endpoint Error:', error);
        return res.status(500).json({ error: 'Internal server error processing request.' });
    }
}
