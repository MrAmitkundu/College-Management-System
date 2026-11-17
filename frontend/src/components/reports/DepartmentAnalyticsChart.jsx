import React from 'react';
import { Download, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from 'recharts';

export default function DepartmentAnalyticsChart({ data, onExportCSV }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <TrendingUp className="w-5 h-5 text-[#7C4DFF]" />
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Department-Wise Enrollment & Pass Rate
            </h2>
            <p className="text-xs text-slate-500">Academic Year 2026 Analytical Overview</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onExportCSV('Department_Analytics')}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#7C4DFF] hover:bg-purple-700 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="dept"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748B' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748B' }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar
              dataKey="students"
              name="Total Students"
              fill="#1464F6"
              radius={[6, 6, 0, 0]}
              barSize={36}
            />
            <Bar
              dataKey="passRate"
              name="Pass Rate (%)"
              fill="#109E62"
              radius={[6, 6, 0, 0]}
              barSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}