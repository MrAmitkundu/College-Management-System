import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';

export default function GeneratedReportsGrid({ reports, onDownloadReport }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-base font-bold text-slate-800 mb-4">Generated System Reports</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reports.map((rep, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200/80 bg-[#F4F7FE]/50 hover:bg-white hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-[#7C4DFF] flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">{rep.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{rep.desc}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Updated: {rep.updated}</span>
              <button
                type="button"
                onClick={() => onDownloadReport(rep.title)}
                className="text-xs font-semibold text-[#1464F6] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}