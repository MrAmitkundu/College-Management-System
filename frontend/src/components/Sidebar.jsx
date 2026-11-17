import React from 'react';
import {
  Home, Users, UserCheck, BookOpen, ArrowLeftRight, FileCheck,
  Bell, BarChart2, BrainCircuit, Settings, LogOut
} from 'lucide-react';
import collegeLogo from '../assets/logo.png';

const navItems = [
  { name: 'Dashboard', icon: Home },
  { name: 'Students', icon: Users },
  { name: 'Faculty', icon: UserCheck },
  { name: 'Library', icon: BookOpen },
  { name: 'Transactions', icon: ArrowLeftRight },
  { name: 'Examinations', icon: FileCheck },
  { name: 'Notices', icon: Bell },
  { name: 'Reports', icon: BarChart2 },
  { name: 'AI Analytics', icon: BrainCircuit },
  { name: 'Settings', icon: Settings },
];

export default function Sidebar({ activeNav, setActiveNav, sidebarOpen }) {
  return (
    <aside
      className={`${sidebarOpen ? 'w-64' : 'w-20'
        } bg-[#092147] text-white flex flex-col justify-between transition-all duration-300 shrink-0 relative overflow-hidden`}
    >
      <div>
        <div className="p-6 flex flex-col items-center text-center border-b border-white/10">
          <div className="w-12 h-20 bg-amber-400/15 border border-amber-400/40 flex items-center justify-center mb-3 shadow-inner overflow-hidden">
            <img
              src={collegeLogo}
              alt="College Logo"
              className="w-full h-full object-cover object-center"
            />
          </div>
          {sidebarOpen && (
            <>
              <h1 className="font-bold text-lg tracking-wide text-white">B.B. College</h1>
              <p className="text-xs text-blue-200/80 mt-0.5">Management System</p>
            </>
          )}
        </div>

        <nav className="mt-5 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setActiveNav(item.name)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${isActive
                  ? 'bg-gradient-to-r from-[#1A6DFF] to-[#2B82FF] text-white shadow-lg shadow-blue-950/50'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10 relative z-10">
        <button
          type="button"
          onClick={() => alert('Logged out!')}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>

        {sidebarOpen && (
          <div className="mt-6 px-3 pb-4">
            <p className="font-serif italic text-sm text-blue-100/80 leading-relaxed">
              Education Today...
              <br />A Better Tomorrow...
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}