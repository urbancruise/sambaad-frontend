import React from 'react';
import { Award, AlertTriangle } from 'lucide-react';

export default function IncentiveIndexCard() {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h4 className="font-bold text-white text-md">Incentive Distribution Index</h4>
          <p className="text-xs text-slate-400 font-medium">Algorithmic output score validation</p>
        </div>
        <div className="p-2.5 bg-white/10 text-emerald-400 rounded-xl border border-white/5 backdrop-blur-md">
          <Award size={20} />
        </div>
      </div>

      <div className="flex items-center gap-6 relative z-10">
        <div className="w-24 h-24 rounded-full border-4 border-slate-800 border-t-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
          <div className="text-center">
            <span className="text-2xl font-black text-white tracking-tight">92</span>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">INDEX</p>
          </div>
        </div>

        <div className="space-y-2">
          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
            High Tier Eligibility
          </span>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            Squad is trending toward a <strong className="text-emerald-400">12% multiplier bonus</strong> based on on-time closures and activity metrics.
          </p>
        </div>
      </div>

      <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-400 flex items-start gap-2">
        <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-normal font-medium">
          Incentive multipliers are locked until the active appraisal period passes. Metrics represent live calculations.
        </p>
      </div>
    </div>
  );
}