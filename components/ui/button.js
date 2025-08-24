import React from 'react';

export function Button({ className = '', variant = 'default', size = 'md', ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    default: 'bg-emerald-600 text-white hover:bg-emerald-500',
    outline: 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50',
    ghost: 'text-emerald-600 hover:bg-emerald-50',
  };
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg',
  };
  return (
    <button
      className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    />
  );
}