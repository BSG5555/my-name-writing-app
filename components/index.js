export { Button } from './ui/button';
export { Input } from './ui/input';
export {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table';

import React from 'react';

export function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded shadow-lg p-4 relative max-w-lg w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export function Calendar({ selectedDate, onSelect }) {
  return (
    <div>
      <input
        type="date"
        value={selectedDate.toISOString().slice(0, 10)}
        onChange={e => onSelect(new Date(e.target.value))}
        className="border rounded px-2 py-1"
        aria-label="Select date"
      />
    </div>
  );
}
