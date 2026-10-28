export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, participationType } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

  const resendKey = process.env.RESEND_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  try {
    // 1. Cloud Database (Supabase) if configured
    if (supabaseUrl && supabaseKey) {
      await fetch(`${supabaseUrl}/rest/v1/registrations`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ name, email, participation_type: participationType, created_at: new Date() })
      });
    }

    // 2. Real Email Dispatch (Resend) if configured
    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Frostbite <onboarding@resend.dev>',
          to: [email],
          subject: 'Registration Confirmed: Frostbite 2025',
          html: `<p>Hi <strong>${name}</strong>,</p><p>You are officially registered for the <strong>Frostbite Community Run</strong> on <strong>May 12, 2025</strong> at the Green Bay Trail, Glencoe, IL!</p><p>We will send full logistics closer to race day.</p>`
        })
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Registration confirmed',
      cloudSynced: !!(supabaseUrl && supabaseKey),
      emailSent: !!resendKey
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
