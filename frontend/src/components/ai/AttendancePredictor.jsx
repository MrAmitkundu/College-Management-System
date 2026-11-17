import React from 'react';
import { CalendarCheck, AlertCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine
} from 'recharts';

export default function AttendancePredictor({ student }) {
  if (!student) return null;
  const { attendance, currentAttendance } = student;
  const isRisk = attendance.predictedEndSem < 75;

  return (
    <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-xl">
              <CalendarCheck className="w-4 h-4 text-[#1464F6]" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Attendance Prediction</h3>
          </div>
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
              isRisk ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-[#1464F6]'
            }`}
          >
            {attendance.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 my-4 pb-4 border-b border-slate-100">
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Current</p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">{currentAttendance}%</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase">End-Sem Forecast</p>
            <p className={`text-2xl font-bold mt-0.5 ${isRisk ? 'text-rose-600' : 'text-[#1464F6]'}`}>
              {attendance.predictedEndSem}%
            </p>
          </div>
        </div>

        <div className="h-32 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendance.monthlyTrend}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: '#64748b' }} width={26} />
              <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '11px' }} />
              <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="actual"
                name="Actual %"
                stroke="#1464F6"
                strokeWidth={2}
                dot={{ r: 2.5 }}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                name="Predicted %"
                stroke="#93c5fd"
                strokeDasharray="4 4"
                strokeWidth={2}
                dot={{ r: 2.5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        className={`p-3 rounded-xl border flex items-center gap-2 mt-3 ${
          isRisk
            ? 'bg-rose-50/80 border-rose-100 text-rose-800'
            : 'bg-blue-50/80 border-blue-100 text-blue-800'
        }`}
      >
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        <p className="text-[11px] font-medium leading-snug">
          {isRisk
            ? `Attend next ${attendance.classesNeededFor75} consecutive classes to reach 75%.`
            : `Safe margin: Can miss up to ${attendance.classesCanMiss} upcoming classes.`}
        </p>
      </div>
    </div>
  );
}