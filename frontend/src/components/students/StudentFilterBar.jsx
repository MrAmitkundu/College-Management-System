import React from 'react';
import { Search } from 'lucide-react';

export default function StudentFilterBar({
  searchQuery,
  setSearchQuery,
  selectedDept,
  setSelectedDept,
  selectedStatus,
  setSelectedStatus,
  departments,
  onReset,
  hasActiveFilters,
}) {
  return (
    <div className="mb-6 p-4 bg-[#F4F7FE] rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
      {/* Search by Name / ID */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
          Search Name / ID
        </label>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. Riya or STU-1001"
            className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
      </div>

      {/* Department Filter */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
          Department
        </label>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
          Status
        </label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Pending Fee">Pending Fee</option>
        </select>
      </div>

      {/* Clear Button */}
      <div>
        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveFilters}
          className="w-full py-2 px-3 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}