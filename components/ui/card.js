import React from 'react';

export function Card({ className = '', ...props }) {
  return <div className={`rounded-lg border bg-white shadow-sm ${className}`} {...props} />;
}
export function CardHeader({ className = '', ...props }) {
  return <div className={`p-4 border-b ${className}`} {...props} />;
}
export function CardTitle({ className = '', ...props }) {
  return <h3 className={`font-semibold leading-none tracking-tight ${className}`} {...props} />;
}
export function CardContent({ className = '', ...props }) {
  return <div className={`p-4 pt-2 ${className}`} {...props} />;
}
export function CardFooter({ className = '', ...props }) {
  return <div className={`p-4 border-t ${className}`} {...props} />;
}