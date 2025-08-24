// API route for payment processing
import { supabase } from '@/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, amount, mode, transactionId, submissionDate } = req.body;
    
    if (!userId || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create payment record in Supabase
    const paymentData = {
      user_id: userId,
      amount: amount,
      mode: mode || 'MANUAL',
      status: 'PENDING',
      transaction_id: transactionId || '',
      submission_date: submissionDate || '',
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select();

    if (error) {
      console.error('Payment creation error:', error);
      return res.status(500).json({ error: 'Failed to create payment record' });
    }

    res.status(200).json({ 
      success: true, 
      payment: data[0] 
    });
  } catch (error) {
    console.error('Payment API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}