import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function ExamCardGrid({ exams, onResetFilter }) {
  if (exams.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
        No examinations found for the selected department.{' '}
        <button
          type="button"
          onClick={onResetFilter}
          className="text-[#1464F6] font-semibold hover:underline cursor-pointer"
        >
          View all departments
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {exams.map((exam, idx) => (
        <div
          key={`${exam.code}-${idx}`}
          className="p-5 rounded-xl border border-slate-200/80 bg-[#F4F7FE]/50 hover:bg-white hover:shadow-md transition flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#1464F6] bg-blue-50 px-2.5 py-1 rounded-md">
                {exam.code} • {exam.dept}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  exam.status === 'Scheduled'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {exam.status}
              </span>
            </div>

            <h3 className="font-bold text-slate-800 text-base mt-3">{exam.subject}</h3>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/70 flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> {exam.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> {exam.time}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {exam.room}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}