import { supabase } from '@/supabaseClient';

export const Submission = {
  async list(userId = null) {
    try {
      let query = supabase
        .from('submissions')
        .select('*')
        .order('date', { ascending: false });
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }
  },
  
  async filter(query) {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .or(query)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error filtering submissions:', error);
      return [];
    }
  },
  
  async create(submissionData) {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .insert([{
          user_id: submissionData.userId,
          date: submissionData.date,
          timestamp: submissionData.timestamp || new Date().toISOString(),
          file_url: submissionData.fileUrl,
          user_notes: submissionData.userNotes || '',
          submission_status: submissionData.submissionStatus || 'PENDING',
          payment_status: submissionData.paymentStatus || 'PENDING',
          proof_url: submissionData.proofUrl || '',
          admin_notes: submissionData.adminNotes || ''
        }])
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        submissionId: data.id,
        userId: data.user_id,
        date: data.date,
        timestamp: data.timestamp,
        fileUrl: data.file_url,
        userNotes: data.user_notes,
        submissionStatus: data.submission_status,
        paymentStatus: data.payment_status,
        proofUrl: data.proof_url,
        adminNotes: data.admin_notes,
        ...submissionData
      };
    } catch (error) {
      console.error('Error creating submission:', error);
      // Fallback for development
      return { id: Date.now().toString(), ...submissionData };
    }
  }
};