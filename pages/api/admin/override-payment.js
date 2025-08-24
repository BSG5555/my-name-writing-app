// Admin override payment endpoint
// Notes:
// - The earlier deployment failure complaining about NEXT_PUBLIC_RAZORPAY_KEY was due to
//   a missing Vercel Secret named "razorpay_key" that the environment variable references.
//   Changing this file alone cannot fix that; you must ensure the secret exists in Vercel
//   (Project Settings -> Environment Variables) and then redeploy.
// - We now explicitly read the Razorpay public key so that a clear warning/error appears
//   in logs if it is absent. If this key is NOT actually needed by this server route,
//   you can change the THROW_IF_MISSING_RAZORPAY_KEY flag below to false to only warn.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RAZORPAY_PUBLIC_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY || ''; // Public (key_id) only.

// Set this to false if you prefer to allow the route even when the public key is missing.
const THROW_IF_MISSING_RAZORPAY_KEY = true;

// Quick environment sanity checks (do NOT log secrets)
if (!SUPABASE_URL) {
  console.error('override-payment: Missing NEXT_PUBLIC_SUPABASE_URL environment variable.');
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('override-payment: Missing SUPABASE_SERVICE_ROLE_KEY environment variable.');
}
if (!RAZORPAY_PUBLIC_KEY) {
  const msg = 'override-payment: NEXT_PUBLIC_RAZORPAY_KEY (public key) is not set.';
  if (THROW_IF_MISSING_RAZORPAY_KEY) {
    // Will cause 500 responses until fixed (makes the problem obvious in testing).
    console.error(msg);
  } else {
    console.warn(msg + ' Proceeding anyway because THROW_IF_MISSING_RAZORPAY_KEY=false.');
  }
}

const supabaseServer = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ALLOWED_STATUSES = new Set(['APPROVED', 'REJECTED', 'CREATED']);

// Basic helpers
function isUuid(value) {
  return typeof value === 'string' && /^[0-9a-fA-F-]{36}$/.test(value);
}
function isIntegerString(value) {
  return typeof value === 'string' && /^\d+$/.test(value);
}

export default async function handler(req, res) {
  // If we require the public key present, block early (only impacts this route).
  if (THROW_IF_MISSING_RAZORPAY_KEY && !RAZORPAY_PUBLIC_KEY) {
    return res.status(500).json({
      error: 'Server misconfiguration: NEXT_PUBLIC_RAZORPAY_KEY missing. Add the secret and redeploy.'
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ error: 'Missing authorization token' });

  try {
    // Verify token and get user info using the service client
    const { data: authData, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !authData?.user) {
      console.error('override-payment: auth verification failed:', authError?.message || 'unknown');
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
      console.error('override-payment: caller lookup failed:', callerError?.message || 'no user row');
      return res.status(403).json({ error: 'User record not found or no permission' });
    }
    if (callerRow.role !== 'admin') {
      return res.status(403).json({ error: 'Admin role required' });
    }

    const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    let { paymentId, newStatus } = body || {};

    if (paymentId === undefined || newStatus === undefined) {
      return res.status(400).json({ error: 'paymentId and newStatus are required' });
    }

    // Normalize/validate paymentId: accept numeric ids or UUIDs
    if (typeof paymentId === 'number') {
      paymentId = String(paymentId);
    } else if (isIntegerString(paymentId)) {
      // ok
    } else if (isUuid(paymentId)) {
      // ok
    } else {
      return res.status(400).json({ error: 'Invalid paymentId format' });
    }

    if (typeof newStatus !== 'string' || !ALLOWED_STATUSES.has(newStatus)) {
      return res.status(400).json({ error: 'Invalid newStatus' });
    }

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
      console.error('override-payment: update failed:', updateError?.message || 'unknown');
      return res.status(500).json({ error: 'Failed to update payment' });
    }
    if (!updated) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Include (non-sensitive) info that Razorpay key is recognized (do NOT send key itself)
    return res.json({
      ok: true,
      payment: updated,
      razorpayKeyDetected: Boolean(RAZORPAY_PUBLIC_KEY) // purely diagnostic
    });
  } catch (err) {
    console.error('override-payment: internal error:', err?.message || err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
