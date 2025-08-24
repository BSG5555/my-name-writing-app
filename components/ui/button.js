import React from 'react';

export function Button({ className = '', variant = 'default', ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-md border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    default: 'bg-white hover:bg-gray-50 border-gray-300 text-gray-800',
    primary: 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600',
    subtle: 'bg-gray-100 hover:bg-gray-200 border-transparent text-gray-800',
    ghost: 'bg-transparent border-transparent hover:bg-gray-100',
    danger: 'bg-red-600 hover:bg-red-500 text-white border-red-600',
    outline: 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
  };
  return (
    <button
      className={`${base} ${variants[variant] || variants.default} px-3 py-1.5 ${className}`}
      {...props}
    />
  );
}