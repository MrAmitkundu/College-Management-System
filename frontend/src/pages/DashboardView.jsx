import React from 'react';
import {
  BarChart2, Bell, ArrowRight, Zap, BookOpen,
  Users, FileText, Calendar, Clock
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip
} from 'recharts';
import { overviewData, statCards, notices, activities } from '../data/mockData';

import collegeImg from '../assets/college_image.jpeg';

export default function DashboardView({ onNavigate }) {
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-md h-52 flex items-center">
        <img
          src={collegeImg}
          alt="College Campus"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09327A] via-[#0F49AC]/95 to-transparent" />
        <div className="relative z-10 px-8 max-w-2xl text-white">
          <h2 className="text-2xl sm:text-3xl font-bold leading-snug">
            Welcome to
            <br />
            B.B. College Management System
          </h2>
          <p className="text-blue-100 text-sm sm:text-base mt-2">
            Smart Management. Better Education.
          </p>
          <div className="w-12 h-1 bg-amber-400 rounded-full mt-4" />
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full ${card.bgIcon} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{card.title}</p>
                </div>
              </div>

              <div className="flex items-end justify-between mt-4 pt-1">
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  ↑ {card.trend}
                </span>
                <div className="w-28 h-9">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={card.sparkData}>
                      <defs>
                        <linearGradient id={`spark-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={card.color} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={card.color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke={card.color}
                        strokeWidth={2}
                        fill={`url(#spark-${index})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Section: Chart + Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5">
              <BarChart2 className="w-5 h-5 text-[#092147]" />
              <h3 className="font-bold text-slate-800 text-base">College Overview</h3>
            </div>
            <select className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-5 text-xs font-medium text-slate-600 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1464F6]" />
              Students
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7C4DFF]" />
              Transactions
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overviewData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="studentsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1464F6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1464F6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="transGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C4DFF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7C4DFF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#F1F5F9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickFormatter={(val) => (val >= 1000 ? `${val / 1000}K` : val)}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="students" stroke="#1464F6" strokeWidth={2} fillOpacity={1} fill="url(#studentsGrad)" dot={{ r: 3.5, fill: '#1464F6', strokeWidth: 0 }} />
                <Area type="monotone" dataKey="transactions" stroke="#7C4DFF" strokeWidth={2} fillOpacity={1} fill="url(#transGrad)" dot={{ r: 3.5, fill: '#7C4DFF', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <Bell className="w-5 h-5 text-[#1464F6]" />
                <h3 className="font-bold text-slate-800 text-base">Latest Notices</h3>
              </div>
              <button
                onClick={() => onNavigate('Notices')}
                className="text-xs font-semibold text-[#1464F6] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {notices.map((notice, idx) => (
                <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div className="flex items-stretch gap-3">
                    <span className={`w-1 rounded-full shrink-0 ${notice.barColor}`} />
                    <p className="text-sm font-medium text-slate-700 leading-snug">{notice.text}</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap shrink-0 mt-0.5">{notice.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Quick Actions + Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="w-5 h-5 text-[#1464F6] fill-[#1464F6]" />
            <h3 className="font-bold text-slate-800 text-base">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => onNavigate('Library')}
              className="bg-gradient-to-b from-[#1A73E8] to-[#0D59D1] hover:opacity-95 text-white rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2.5 shadow-sm transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-xs font-semibold leading-tight">Issue Book<br />(Library)</span>
            </button>

            <button
              onClick={() => onNavigate('Students')}
              className="bg-gradient-to-b from-[#12A163] to-[#0B8750] hover:opacity-95 text-white rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2.5 shadow-sm transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Users className="w-6 h-6" />
              <span className="text-xs font-semibold leading-tight">Add Student</span>
            </button>

            <button
              onClick={() => onNavigate('Reports')}
              className="bg-gradient-to-b from-[#7E52FF] to-[#6336EB] hover:opacity-95 text-white rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2.5 shadow-sm transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <FileText className="w-6 h-6" />
              <span className="text-xs font-semibold leading-tight">View Reports</span>
            </button>

            <button
              onClick={() => onNavigate('Transactions')}
              className="bg-gradient-to-b from-[#F68E09] to-[#E07A00] hover:opacity-95 text-white rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2.5 shadow-sm transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Calendar className="w-6 h-6" />
              <span className="text-xs font-semibold leading-tight">Manage<br />Transactions</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-[#1464F6]" />
              <h3 className="font-bold text-slate-800 text-base">Recent Activities</h3>
            </div>
            <button className="text-xs font-semibold text-[#1464F6] hover:underline flex items-center gap-1 cursor-pointer">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative pl-4 space-y-3.5 before:content-[''] before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-blue-100">
            {activities.map((item, idx) => (
              <div key={idx} className="relative flex items-center justify-between gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1464F6] ring-4 ring-white absolute -left-4" />
                <p className="text-xs sm:text-sm text-slate-700 truncate">{item.text}</p>
                <span className="text-xs text-slate-400 shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}