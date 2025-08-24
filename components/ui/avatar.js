import React from 'react';

export function Avatar({ className = '', children, ...props }) {
  return (
    <span
      className={`inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-200 ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export function AvatarImage({ src, alt = '', className = '' }) {
  if (!src) return null;
  return <img src={src} alt={alt} className={`h-full w-full object-cover ${className}`} />;
}

export function AvatarFallback({ children, className = '' }) {
  return <span className={`text-sm font-medium text-gray-600 ${className}`}>{children}</span>;
}