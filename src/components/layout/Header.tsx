import React from 'react';
import { Bell } from 'lucide-react';
import { TimeFilter } from '../../features/dashboard/types';

interface HeaderProps {
  timeFilter: TimeFilter;
  setTimeFilter: (filter: TimeFilter) => void;
}

export default function Header({ timeFilter, setTimeFilter }: HeaderProps) {
  const filterOptions: TimeFilter[] = ['week', 'month', 'quarter'];

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-1xl font-bold tracking-tight text-slate-900">Employee Management Dashboard</h1>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">Engineering Team B</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 shadow-sm">
          {filterOptions.map((filter) => (
            <button 
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                timeFilter === filter ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {filter === 'week' ? 'Weekly' : filter === 'month' ? 'Monthly' : 'Quarterly'}
            </button>
          ))}
        </div>

        <button className="p-2.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 bg-white shadow-sm transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>
      </div>
    </header>
  );
}