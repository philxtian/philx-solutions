export default function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    
    // Return safe, public configuration variables
    return res.status(200).json({ 
        gaId: process.env.GA_MEASUREMENT_ID || null
    });
}
