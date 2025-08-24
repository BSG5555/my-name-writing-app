// Core integration file for file uploads and other integrations
import { supabase } from '@/supabaseClient';

export const UploadFile = {
  async uploadImage(file) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('submissions')
        .getPublicUrl(filePath);

      return { url: data.publicUrl };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
};

export default UploadFile;