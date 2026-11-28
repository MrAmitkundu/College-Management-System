
import React, { useState, useEffect } from 'react';

import {
  Mail,
  Building2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Users,
} from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export default function FacultyGrid({
  faculty = [],
  onResetFilters,
  loading = false,
  error = '',
  onRetry,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(faculty.length / ITEMS_PER_PAGE);

  // Reset pagination when faculty data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [faculty.length]);

  // Keep current page within valid range
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = Math.min(
    startIndex + ITEMS_PER_PAGE,
    faculty.length
  );

  const currentFaculty = faculty.slice(startIndex, endIndex);

  // Generate pagination numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('left-ellipsis');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('right-ellipsis');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  // Loading state - no pulse animation
  if (loading) {
    return (
      <div className="space-y-5">

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50">
            <RefreshCw className="w-5 h-5 text-[#109E62]" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700">
              Loading faculty members
            </h3>

            <p className="text-xs text-slate-400 mt-0.5">
              Please wait while we fetch the faculty records...
            </p>
          </div>
        </div>

        {/* Static Skeleton Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <div
              key={index}
              className="p-5 rounded-xl border border-slate-200 bg-white"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-16 bg-slate-200 rounded-full" />
                <div className="h-3 w-20 bg-slate-200 rounded" />
              </div>

              <div className="h-5 w-36 bg-slate-200 rounded mt-5" />

              <div className="h-3 w-28 bg-slate-100 rounded mt-3" />

              <div className="border-t border-slate-100 mt-5 pt-4">
                <div className="h-3 w-48 max-w-full bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>

      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-14 px-5 rounded-xl border border-red-200 bg-red-50/50">

        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-100 mb-4">
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>

        <h3 className="text-base font-bold text-slate-800">
          Unable to load faculty
        </h3>

        <p className="text-sm text-slate-500 mt-2 max-w-md">
          {error || 'Something went wrong while fetching faculty records.'}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#109E62] text-white text-sm font-semibold hover:bg-emerald-700"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}

      </div>
    );
  }

  // Empty state
  if (faculty.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-14 px-5 rounded-xl border border-dashed border-slate-200 bg-white">

        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 mb-4">
          <Users className="w-7 h-7 text-slate-400" />
        </div>

        <h3 className="text-base font-bold text-slate-800">
          No faculty members found
        </h3>

        <p className="text-sm text-slate-500 mt-2">
          No faculty members match your selected filters.
        </p>

        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-4 text-[#109E62] font-semibold text-sm hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        )}

      </div>
    );
  }

  // Faculty cards
  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentFaculty.map((fac) => (
          <div
            key={fac.id}
            className="p-5 rounded-xl border border-slate-200/80 bg-[#F4F7FE]/60 flex flex-col justify-between"
          >
            <div>

              {/* Faculty ID and Designation */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#109E62] bg-emerald-50 px-2.5 py-1 rounded-full">
                  {fac.faculty_id}
                </span>

                <span className="text-[11px] font-medium text-slate-500 truncate">
                  {fac.designation}
                </span>
              </div>

              {/* Faculty Name */}
              <h3 className="font-bold text-slate-800 text-base mt-3">
                {fac.teacher_name}
              </h3>

              {/* Department */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                <span className="truncate">
                  {fac.department}
                </span>
              </div>

            </div>

            {/* Email */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-4 pt-3 border-t border-slate-200/70">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />

              <a
                href={fac.email ? `mailto:${fac.email}` : undefined}
                className="truncate"
                title={fac.email}
              >
                {fac.email || 'No email available'}
              </a>
            </div>

          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-5">

          <p className="text-sm text-slate-500">
            Showing{' '}
            <span className="font-semibold text-slate-700">
              {startIndex + 1}–{endIndex}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-700">
              {faculty.length}
            </span>{' '}
            faculty members
          </p>

          <div className="flex items-center gap-1.5">

            {/* Previous */}
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center gap-1 px-3 h-9 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />

              <span className="hidden sm:inline">
                Previous
              </span>
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page, index) => {
              if (typeof page === 'string') {
                return (
                  <span
                    key={page}
                    className="px-1 text-slate-400 text-sm"
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={`${page}-${index}`}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold ${
                    currentPage === page
                      ? 'bg-[#109E62] text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-emerald-50 hover:text-[#109E62]'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {/* Next */}
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center gap-1 px-3 h-9 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <span className="hidden sm:inline">
                Next
              </span>

              <ChevronRight className="w-4 h-4" />
            </button>

          </div>
        </div>
      )}

      {/* Single page information */}
      {totalPages === 1 && (
        <div className="text-sm text-slate-500 border-t border-slate-200 pt-4">
          Showing{' '}
          <span className="font-semibold text-slate-700">
            {faculty.length}
          </span>{' '}
          faculty members
        </div>
      )}

    </div>
  );
}
