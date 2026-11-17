import React from 'react';
import { Mail, Building2 } from 'lucide-react';

export default function FacultyGrid({ faculty, onResetFilters }) {
  if (faculty.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
        No faculty members match your selected filters.{' '}
        <button
          type="button"
          onClick={onResetFilters}
          className="text-[#109E62] font-semibold hover:underline cursor-pointer"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {faculty.map((fac) => (
        <div
          key={fac.id}
          className="p-5 rounded-xl border border-slate-200/80 bg-[#F4F7FE]/60 hover:bg-white hover:shadow-md transition flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#109E62] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {fac.id}
              </span>
              <span className="text-[11px] font-medium text-slate-500">{fac.role}</span>
            </div>

            <h3 className="font-bold text-slate-800 text-base mt-3">{fac.name}</h3>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{fac.dept}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-4 pt-3 border-t border-slate-200/70">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{fac.email}</span>
          </div>
        </div>
      ))}
    </div>
  );
}