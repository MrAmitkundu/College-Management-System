import React from 'react';
import { Briefcase, CalendarCheck, GraduationCap, AlertTriangle } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export default function CollegeOverviewCards({ data }) {
  if (!data) return null;

  const kpis = [
    {
      title: 'Predicted Placement Rate',
      value: `${data.predictedPlacementRate}%`,
      subtitle: 'Batch 2026-27 ML Forecast',
      icon: Briefcase,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      title: 'Predicted Avg Attendance',
      value: `${data.avgPredictedAttendance}%`,
      subtitle: 'End-of-Semester Projection',
      icon: CalendarCheck,
      color: 'text-[#1464F6]',
      bg: 'bg-blue-50'
    },
    {
      title: 'Predicted Avg SGPA',
      value: `${data.predictedCollegeAvgSgpa} / 10`,
      subtitle: '+0.18 vs Last Semester',
      icon: GraduationCap,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      title: 'Attendance Shortage Risk',
      value: `${data.atRiskAttendanceCount} Students`,
      subtitle: 'Projected below 75% threshold',
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-start justify-between"
            >
              <div>
                <p className="text-xs font-medium text-slate-500">{item.title}</p>
                <h3 className="text-xl font-bold text-slate-800 mt-1">{item.value}</h3>
                <p className="text-[11px] text-slate-400 mt-1">{item.subtitle}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${item.bg}`}>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Department-Wise AI Forecast Chart */}
      <div className="p-5 rounded-2xl border border-slate-100 bg-white">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-800">
            Department-Wise AI Predictions (Whole College)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Predicted placement probability, attendance %, and average marks across departments
          </p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.departmentForecasts} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="dept" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#e2e8f0', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="placementProb" name="Placement Prob (%)" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="avgAttendance" name="Pred. Attendance (%)" fill="#1464F6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="avgMarks" name="Pred. Avg Marks (%)" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}