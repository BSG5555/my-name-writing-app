import React from 'react';

// Simple placeholder calendar. Replace later with a real component.
export function Calendar({ selected, onSelect, className = '' }) {
  const today = new Date();
  return (
    <div
      className={`p-4 border rounded-md text-sm text-gray-700 bg-gray-50 ${className}`}
      role="group"
      aria-label="Calendar placeholder"
    >
      <p className="mb-2 font-medium">Calendar Placeholder</p>
      <button
        type="button"
        onClick={() => onSelect && onSelect(today)}
        className="text-emerald-600 underline"
      >
        Select Today ({today.toLocaleDateString()})
      </button>
      {selected && (
        <div className="mt-2">
          Selected: {new Date(selected).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}