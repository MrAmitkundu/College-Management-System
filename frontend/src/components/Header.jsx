import React from 'react';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';

export default function Header({ onToggleSidebar, onNavigate }) {
  return (
    <header className="h-18 bg-white border-b border-slate-200/70 px-6 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search students, books, or anything..."
            className="w-full pl-10 pr-10 py-2 bg-[#F4F7FE] border border-slate-200/80 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={() => onNavigate('Notices')}
          className="relative p-2 rounded-full hover:bg-slate-100 text-slate-700 transition cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        <div className="flex items-center gap-3 cursor-pointer pl-2 border-l border-slate-200">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amit"
            alt="Amit Kundu"
            className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200"
          />
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-slate-800 leading-tight">Amit Kundu</p>
            <p className="text-xs text-slate-500">Admin</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>
      </div>
    </header>
  );
}