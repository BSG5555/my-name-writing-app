import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kgcsmozgrpnkxjlaxqnv.supabase.co';
// MUST set SUPABASE_SERVICE_ROLE_KEY in your deployment environment (Vercel etc.); never commit it .
const supabaseServer = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing authorization token' });

  try {
    // Verify token and get user info using the service client
    const { data: authData, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !authData?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const callerUid = authData.user.id;

    // Check caller's role in public.users (column 'role')
    const { data: callerRow, error: callerError } = await supabaseServer
      .from('users')
      .select('id, role')
      .eq('id', callerUid)
      .single();

    if (callerError || !callerRow) {
      return res.status(403).json({ error: 'User record not found or no permission' });
    }
    if (callerRow.role !== 'admin') {
      return res.status(403).json({ error: 'Admin role required' });
    }

    const { paymentId, newStatus } = req.body || {};
    if (!paymentId || !newStatus) return res.status(400).json({ error: 'paymentId and newStatus are required' });

    const allowedStatuses = ['APPROVED', 'REJECTED', 'CREATED'];
    if (!allowedStatuses.includes(newStatus)) return res.status(400).json({ error: 'Invalid newStatus' });

    // Update using service role key (bypasses RLS)
    const { data: updated, error: updateError } = await supabaseServer
      .from('payments')
      .update({
        status: newStatus,
        approved_by: callerUid,
        approved_at: new Date().toISOString()
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (updateError) {
      console.error('Payment update error', updateError);
      return res.status(500).json({ error: 'Failed to update payment' });
    }

    return res.json({ ok: true, payment: updated });
  } catch (err) {
    console.error('override-payment error', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
