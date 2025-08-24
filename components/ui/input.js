import React from 'react';

export function Input({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={
        'border rounded px-3 py-2 outline-none focus:ring focus:ring-emerald-300 ' +
        className
      }
    />
  );
}
