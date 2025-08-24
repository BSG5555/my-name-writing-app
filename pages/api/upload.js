// API route for file uploads
import { supabase } from '@/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileName, fileData, userId } = req.body;
    
    if (!fileName || !fileData || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create file buffer from base64 data
    const buffer = Buffer.from(fileData.split(',')[1], 'base64');
    const fileExt = fileName.split('.').pop();
    const uniqueFileName = `${userId}_${Date.now()}.${fileExt}`;
    const filePath = `uploads/${uniqueFileName}`;

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('submissions')
      .upload(filePath, buffer, {
        contentType: `image/${fileExt}`,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload file' });
    }

    // Get public URL
    const { data } = supabase.storage
      .from('submissions')
      .getPublicUrl(filePath);

    res.status(200).json({ 
      success: true, 
      url: data.publicUrl,
      fileName: uniqueFileName 
    });
  } catch (error) {
    console.error('Upload API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Increase body size limit for file uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};