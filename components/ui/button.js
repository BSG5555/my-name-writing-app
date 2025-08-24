import React from 'react';

export function Button({ children, variant, size, className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    default: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    destructive: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-100'
  };
  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-2'
  };
  const v = variants[variant] || variants.default;
  const s = sizes[size] || sizes.md;
  return (
    <button className={`${base} ${v} ${s} ${className}`} {...props}>
      {children}
    </button>
  );
}
