import React from 'react';

export default function StudentTable({ students, onResetFilters }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
            <th className="py-3 px-4">Student ID</th>
            <th className="py-3 px-4">Full Name</th>
            <th className="py-3 px-4">Department</th>
            <th className="py-3 px-4">Year</th>
            <th className="py-3 px-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {students.length > 0 ? (
            students.map((stu) => (
              <tr key={stu.id} className="hover:bg-slate-50/80 transition">
                <td className="py-3.5 px-4 font-semibold text-[#1464F6]">{stu.id}</td>
                <td className="py-3.5 px-4 font-medium text-slate-800">{stu.name}</td>
                <td className="py-3.5 px-4 text-slate-600">{stu.dept}</td>
                <td className="py-3.5 px-4 text-slate-600">{stu.year}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      stu.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {stu.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-10 text-center text-sm text-slate-500">
                No students match your selected filters.{' '}
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="text-[#1464F6] font-semibold hover:underline cursor-pointer"
                >
                  Clear filters
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}