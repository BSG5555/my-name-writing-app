import React, { useState } from 'react';

export function ImagePreviewModal({ isOpen, onClose, imageUrl, title }) {
  const [loading, setLoading] = useState(true);
  if (!imageUrl) return null;
  if (!isOpen) return null;
  return (
    <div role="dialog" aria-label={title || 'Image preview'} className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <div className="relative max-w-full max-h-full">
        <button onClick={onClose} aria-label="Close preview" className="absolute top-2 right-2 bg-white/20 rounded-full p-2">X</button>
        <img
          src={imageUrl}
          alt={title || 'Preview'}
          onLoad={() => setLoading(false)}
          className={`max-w-full max-h-[80vh] object-contain ${loading ? 'opacity-70' : ''}`}
        />
      </div>
    </div>
  );
}
