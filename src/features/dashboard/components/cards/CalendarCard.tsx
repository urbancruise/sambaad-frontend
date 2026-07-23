'use client';

import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarCard() {
  // Static placeholder calendar grid for visualization
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  // Generating a standard 31-day cycle grid wrapper
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const startOffset = 2; // Offset to shift grid alignment nicely

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-emerald-500" />
          <span className="text-sm font-bold text-slate-800">June 2026</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Days Labels Row */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {daysOfWeek.map((day) => (
          <span key={day} className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            {day}
          </span>
        ))}
      </div>

      {/* Monthly Block Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Render empty padded tracking slots */}
        {Array.from({ length: startOffset }).map((_, idx) => (
          <div key={`empty-${idx}`} />
        ))}
        
        {/* Render operational day fields */}
        {days.map((day) => {
          const isToday = day === 24; // Static high-density reference date highlight
          return (
            <button
              key={day}
              className={`text-xs font-semibold py-1.5 rounded-lg transition-all
                ${isToday 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}