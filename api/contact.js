import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    
    const { 'cf-turnstile-response': token, ...formData } = req.body;

    // 1. Verify Turnstile Token with Cloudflare
    const cfRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.CLOUDFLARE_SECRET_KEY}&response=${token}`
    });
    const cfData = await cfRes.json();
    if (!cfData.success) return res.status(400).json({ error: 'Bot detected' });

    // 2. Configure Custom SMTP Transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    // 3. Send Email to info@philxsolutions.com
    await transporter.sendMail({
        from: `"Website Form" <${process.env.SMTP_USER}>`,
        to: 'info@philxsolutions.com',
        subject: 'New Consultation Request',
        text: JSON.stringify(formData, null, 2)
    });

    res.status(200).json({ success: true });
}
