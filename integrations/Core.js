// This file provides core integration functions for the application
// Mainly handles file uploads with Supabase Storage

import { supabase } from '@/lib/supabaseClient';

/**
 * Uploads a file to Supabase Storage
 * @param {Object} params - Upload parameters
 * @param {File} params.file - The file to upload
 * @returns {Promise<{file_url: string}>} The URL of the uploaded file
 */
export async function UploadFile({ file }) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `submissions/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('user-uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(filePath);
    
    return { file_url: urlData.publicUrl };
  }
  catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}