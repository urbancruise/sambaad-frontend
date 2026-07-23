import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function SuccessRateCard() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900 text-md">Team Success Rate</h4>
          <p className="text-xs font-medium text-slate-400">On-time delivery ratio tracking</p>
        </div>
        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
          <TrendingUp size={20} />
        </div>
      </div>

      <div className="flex items-baseline gap-2 pt-2">
        <span className="text-4xl font-extrabold tracking-tight text-slate-900">88.4%</span>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">+2.3% variance</span>
      </div>

      <div className="space-y-2 pt-2">
        <div className="flex justify-between text-xs font-semibold text-slate-600">
          <span>Target Deadline Compliance Match</span>
          <span>26 / 30 On-Time</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-lg flex overflow-hidden border border-slate-200">
          <div className="h-full bg-emerald-500" style={{ width: '88%' }} />
          <div className="h-full bg-rose-500" style={{ width: '12%' }} />
        </div>
        <div className="flex gap-4 text-[11px] font-semibold text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span>
            <span>On-Time Tasks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm"></span>
            <span>Missed Targets</span>
          </div>
        </div>
      </div>
    </div>
  );
}