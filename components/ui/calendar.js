import React from 'react';

export const Calendar = React.forwardRef(({ className = '', selected, onSelect, ...props }, ref) => {
  // This is a simplified calendar component
  // In a real app, you'd use a library like react-day-picker
  return (
    <div
      ref={ref}
      className={`inline-block text-sm border rounded-md p-4 bg-white ${className}`}
      {...props}
    >
      <div className="text-center text-gray-600">
        Calendar Component
        {selected && (
          <div className="mt-2 text-emerald-600">
            Selected: {selected.toDateString()}
          </div>
        )}
      </div>
    </div>
  );
});

Calendar.displayName = 'Calendar';