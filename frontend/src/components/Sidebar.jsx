
import React from 'react';

import {
  Home,
  Users,
  UserCheck,
  ArrowLeftRight,
  FileCheck,
  Bell,
  BarChart2,
  BrainCircuit,
  Settings,
  LogOut,
} from 'lucide-react';

import collegeLogo from '../assets/logo.png';

const navItems = [
  { name: 'Dashboard', icon: Home },
  { name: 'Students', icon: Users },
  { name: 'Faculty', icon: UserCheck },
  { name: 'Transactions', icon: ArrowLeftRight },
  { name: 'Examinations', icon: FileCheck },
  { name: 'Notices', icon: Bell },
  { name: 'Reports', icon: BarChart2 },
  { name: 'AI Analytics', icon: BrainCircuit },
  { name: 'Settings', icon: Settings },
];

export default function Sidebar({
  activeNav,
  setActiveNav,
  sidebarOpen,
}) {
  return (
    <aside
      className={`
        fixed
        top-0
        left-0
        z-50
        ${sidebarOpen ? 'w-64' : 'w-20'}
        h-screen
        bg-[#092147]
        text-white
        flex
        flex-col
        transition-all
        duration-300
        ease-in-out
        overflow-hidden
        shrink-0
        border-r
        border-white/10
      `}
    >
      {/* College Logo and Header */}
      <div className="shrink-0">
        <div className="px-4 py-6 flex flex-col items-center text-center border-b border-white/10">
          <div
            className="
              w-12
              h-16
              bg-amber-400/15
              border
              border-amber-400/40
              flex
              items-center
              justify-center
              mb-3
              shadow-inner
              overflow-hidden
              rounded-lg
            "
          >
            <img
              src={collegeLogo}
              alt="College Logo"
              className="w-full h-full object-contain"
            />
          </div>

          {sidebarOpen && (
            <>
              <h1 className="font-bold text-lg tracking-wide text-white">
                B.B. College
              </h1>

              <p className="text-xs text-blue-200/80 mt-0.5">
                Management System
              </p>
            </>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav
        className="
          flex-1
          overflow-y-auto
          overflow-x-hidden
          px-3
          py-5
          space-y-1
          custom-sidebar-scrollbar
        "
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.name;

          return (
            <button
              key={item.name}
              type="button"
              title={!sidebarOpen ? item.name : undefined}
              onClick={() => setActiveNav(item.name)}
              className={`
                w-full
                flex
                items-center
                ${sidebarOpen ? 'gap-3.5' : 'justify-center'}
                px-4
                py-3
                rounded-xl
                text-sm
                font-medium
                transition-all
                duration-200
                cursor-pointer
                ${
                  isActive
                    ? 'bg-gradient-to-r from-[#1A6DFF] to-[#2B82FF] text-white shadow-lg shadow-blue-950/50'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <Icon className="w-5 h-5 shrink-0" />

              {sidebarOpen && (
                <span className="whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="shrink-0 border-t border-white/10 p-4">
        <button
          type="button"
          title={!sidebarOpen ? 'Logout' : undefined}
          onClick={() => alert('Logged out!')}
          className={`
            w-full
            flex
            items-center
            ${sidebarOpen ? 'gap-3.5' : 'justify-center'}
            px-4
            py-3
            rounded-xl
            text-sm
            font-medium
            text-slate-300
            hover:bg-white/10
            hover:text-white
            transition-all
            duration-200
            cursor-pointer
          `}
        >
          <LogOut className="w-5 h-5 shrink-0" />

          {sidebarOpen && <span>Logout</span>}
        </button>

        {sidebarOpen && (
          <div className="mt-4 px-3 pb-2">
            <p className="font-serif italic text-sm text-blue-100/80 leading-relaxed">
              Education Today...
              <br />
              A Better Tomorrow...
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
