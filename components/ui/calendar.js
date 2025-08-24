import React, { useState, useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
  format
} from 'date-fns';

/**
 * Lightweight Calendar component supporting:
 * - mode (currently only 'single' is meaningful but accepted for compatibility)
 * - disabled(date) function
 * - modifiers: { name: Date[] }
 * - modifiersClassNames: { name: 'class string' }
 * - modifiersLabels: { name: 'Accessible label' }
 */
export function Calendar({
  mode = 'single',
  disabled,
  modifiers = {},
  modifiersClassNames = {},
  modifiersLabels = {},
  className = '',
  selectedDate,
  onSelect
}) {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const grid = [];
    let day = gridStart;
    while (day <= monthEnd || grid.length % 7 !== 0) {
      grid.push(day);
      day = addDays(day, 1);
    }
    return grid;
  }, [currentMonth]);

  function getModifiersForDay(day) {
    const applied = [];
    Object.entries(modifiers).forEach(([name, value]) => {
      if (Array.isArray(value)) {
        if (value.some(d => isSameDay(d, day))) applied.push(name);
      } else if (value instanceof Date) {
        if (isSameDay(value, day)) applied.push(name);
      }
    });
    return applied;
  }

  return (
    <div className={`border rounded-md p-4 bg-white ${className}`}> 
      <div className="flex justify-between items-center mb-2">
        <button
          type="button"
          className="text-sm px-2 py-1 rounded hover:bg-gray-100"
          onClick={() =>
            setCurrentMonth(prev => addDays(prev, -1 * prev.getDate()))
          }
        >
          {'<'}
        </button>
        <div className="font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </div>
        <button
          type="button"
          className="text-sm px-2 py-1 rounded hover:bg-gray-100"
          onClick={() =>
            setCurrentMonth(prev =>
              addDays(prev, endOfMonth(prev).getDate() - prev.getDate() + 1)
            )
          }
        >
          {'>'}
        </button>
      </div>
      <div className="grid grid-cols-7 text-xs font-medium text-gray-500 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-sm">
        {days.map(d => {
          const isDisabled = disabled ? disabled(d) : false;
          const isSelected =
            selectedDate && isSameDay(new Date(selectedDate), d);
          const mods = getModifiersForDay(d);
          const modClasses = mods
            .map(m => modifiersClassNames[m])
            .filter(Boolean)
            .join(' ');
          return (
            <button
              key={d.toISOString()}
              type="button"
              disabled={isDisabled}
              aria-label={
                mods
                  .map(m => modifiersLabels[m])
                  .filter(Boolean)
                  .join(', ') || format(d, 'PPP')
              }
              onClick={() => {
                if (isDisabled) return;
                if (mode === 'single' && onSelect) onSelect(d);
              }}
              className={[
                'h-10 w-10 m-[2px] flex items-center justify-center rounded-md transition-colors',
                !isSameMonth(d, currentMonth)
                  ? 'text-gray-300'
                  : 'text-gray-700',
                isDisabled
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-gray-100',
                isSelected
                  ? 'bg-emerald-500 text-white hover:bg-emerald-500'
                  : '',
                modClasses
              ].join(' ')}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        {Object.keys(modifiers).map(key => (
          <div key={key} className="flex items-center gap-1">
            <span
              className={`inline-block w-3 h-3 rounded-sm ${
                modifiersClassNames[key] || 'bg-gray-200'
              }`}
            />
            <span>{modifiersLabels[key] || key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}