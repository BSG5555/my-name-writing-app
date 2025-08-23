import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ImagePreviewModal({ isOpen, onClose, imageUrl, title }) {
  const [loading, setLoading] = useState(true);

  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-full max-h-full w-screen h-screen p-0 bg-black/95 border-none flex flex-col justify-center items-center"
        aria-label={title || 'Image preview'}
      >
        <div className="absolute top-4 right-4 z-50">
          <Button onClick={onClose} className="bg-white/20 hover:bg-white/40 text-white rounded-full p-2 h-auto w-auto">
            <X className="w-6 h-6" />
          </Button>
        </div>
        {title && (
          <div className="absolute top-4 left-4 text-white text-lg font-semibold bg-black/50 px-3 py-1 rounded">
            {title}
          </div>
        )}
        <div className="w-full h-full flex items-center justify-center p-4">
          {loading && <div className="text-white">Loading image...</div>}
          <img
            src={imageUrl}
            alt="Preview"
            className={`max-w-full max-h-full object-contain ${loading ? 'opacity-50' : ''}`}
            onLoad={() => setLoading(false)}
            onError={(e) => {
              setLoading(false);
              e.target.src = 'data:image/svg+xml;base64,...'; // fallback image
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}