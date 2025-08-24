import { supabase } from '@/supabaseClient';

export const Payment = {
  async list(userId = null) {
    try {
      let query = supabase
        .from('payments')
        .select('*')
        .order('date', { ascending: false });
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
  },
  
  async update(id, fields) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update(fields)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error updating payment:', error);
      // Fallback for development
      return { id, ...fields };
    }
  },
  
  async filter(query) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .or(query)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error filtering payments:', error);
      return [];
    }
  },
  
  async bulkCreate(rows) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert(rows)
        .select();

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error bulk creating payments:', error);
      // Fallback for development
      return rows.map((r, i) => ({ id: `bulk_${i}`, ...r }));
    }
  },
  
  async create(paymentData) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([{
          user_id: paymentData.userId,
          amount: paymentData.amount,
          mode: paymentData.mode || 'MANUAL',
          status: paymentData.status || 'PENDING',
          transaction_id: paymentData.transactionId || '',
          date: paymentData.date || new Date().toISOString().split('T')[0],
          timestamp: paymentData.timestamp || new Date().toISOString(),
          proof_url: paymentData.proofUrl || '',
          submission_date: paymentData.submissionDate || '',
          notes: paymentData.notes || ''
        }])
        .select()
        .single();

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }
};