import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function MarksPredictor({ student }) {
  if (!student) return null;
  const { marks, currentCgpa } = student;

  return (
    <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Marks & SGPA Prediction</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 my-4 pb-4 border-b border-slate-100">
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Current CGPA</p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">{currentCgpa}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Predicted SGPA</p>
            <p className="text-2xl font-bold text-indigo-600 mt-0.5">{marks.predictedNextSgpa}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-semibold text-slate-500 uppercase">
            Subject End-Sem Forecast (Out of 100)
          </p>
          {marks.subjectForecasts.map((sub, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">{sub.subject}</span>
                <span className="font-bold text-indigo-600">{sub.predictedTotal}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${sub.predictedTotal}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Internal Score: {sub.currentInternal}/30
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}