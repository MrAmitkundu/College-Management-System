import React from 'react';
import { Briefcase, CheckCircle2, Sparkles } from 'lucide-react';

export default function PlacementPredictor({ student }) {
  if (!student) return null;
  const { placement } = student;

  const badgeColor =
    placement.probability >= 80
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
      : placement.probability >= 60
      ? 'bg-amber-50 text-amber-700 border-amber-200/70'
      : 'bg-rose-50 text-rose-700 border-rose-200/70';

  return (
    <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <Briefcase className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Placement Prediction</h3>
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${badgeColor}`}>
            {placement.tier}
          </span>
        </div>

        <div className="flex items-end justify-between my-4 pb-4 border-b border-slate-100">
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Selection Prob.</p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">{placement.probability}%</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Est. CTC Range</p>
            <p className="text-sm font-bold text-emerald-600 mt-1">{placement.expectedPackageLpa}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-[11px] font-semibold text-slate-500 uppercase">Key Positive Factors</p>
          {placement.topStrengths.map((strength, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{strength}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#1464F6] shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-800">AI Tip: </span>
          {placement.improvementTip}
        </p>
      </div>
    </div>
  );
}