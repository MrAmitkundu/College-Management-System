import React from 'react';
import { Calendar, Trash2 } from 'lucide-react';

export default function NoticeList({ notices, onDeleteNotice, onOpenModal }) {
  if (notices.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
        No notices have been posted yet.{' '}
        <button
          type="button"
          onClick={onOpenModal}
          className="text-[#1464F6] font-semibold hover:underline cursor-pointer"
        >
          Post the first notice
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notices.map((notice, idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl border border-slate-200/80 bg-[#F4F7FE]/50 hover:bg-white transition flex items-center justify-between gap-4"
        >
          <div className="flex items-stretch gap-3.5">
            <span className={`w-1.5 rounded-full shrink-0 ${notice.barColor}`} />
            <div>
              <p className="text-sm font-semibold text-slate-800">{notice.text}</p>
              <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" /> Published: {notice.date}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onDeleteNotice(idx)}
            title="Delete Notice"
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}