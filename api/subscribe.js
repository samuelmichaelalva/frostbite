export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const resendKey = process.env.RESEND_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  try {
    if (supabaseUrl && supabaseKey) {
      await fetch(`${supabaseUrl}/rest/v1/subscribers`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ email, created_at: new Date() })
      });
    }

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
          subject: 'Subscribed to Frostbite Updates',
          html: `<p>Thank you for subscribing to <strong>Frostbite — Running For Change</strong> updates!</p>`
        })
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Subscribed',
      cloudSynced: !!(supabaseUrl && supabaseKey),
      emailSent: !!resendKey
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
