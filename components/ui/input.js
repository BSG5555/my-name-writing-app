import React from 'react';

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...props}
    />
  );
}