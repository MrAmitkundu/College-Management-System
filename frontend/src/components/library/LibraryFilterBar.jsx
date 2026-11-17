import React from 'react';
import { Search } from 'lucide-react';

export default function LibraryFilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  categories,
  onReset,
  hasActiveFilters,
}) {
  return (
    <div className="mb-6 p-4 bg-[#F4F7FE] rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
      {/* Search Title / Author / ISBN */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
          Search Title / Author / ISBN
        </label>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. Python or Joshua..."
            className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Availability Filter */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
          Availability
        </label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
        >
          <option value="All">All Books</option>
          <option value="Available">Available</option>
          <option value="Issued">Issued</option>
        </select>
      </div>

      {/* Reset Button */}
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