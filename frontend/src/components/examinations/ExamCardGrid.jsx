import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  ClipboardList,
} from 'lucide-react';

// Helper to parse YYYY-MM-DD + start time (e.g. "10:00 AM - 1:00 PM") into a timestamp
function getExamStartTimestamp(exam) {
  if (!exam?.date) return Number.MAX_SAFE_INTEGER;

  const [year, month, day] = String(exam.date).split('-').map(Number);
  if (!year || !month || !day) return Number.MAX_SAFE_INTEGER;

  let hours = 0;
  let minutes = 0;

  if (exam.time_slot) {
    const startPart = String(exam.time_slot).split(/\s*(?:-|–|—)\s*/)[0]?.trim();
    const match = startPart?.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2] || '0', 10);
      const meridiem = match[3]?.toUpperCase();
      if (meridiem === 'PM' && hours !== 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;
    }
  }

  return new Date(year, month - 1, day, hours, minutes, 0, 0).getTime();
}

export default function ExamCardGrid({
  exams = [],
  onResetFilter,
  loading = false,
  error = '',
  onRetry,
}) {
  const ITEMS_PER_PAGE = 6;

  const [currentPage, setCurrentPage] = useState(1);

  // Sort: On Going -> Upcoming Scheduled (nearest first, later at end) -> Exam Finished (at last)
  const sortedExams = useMemo(() => {
    return [...exams].sort((a, b) => {
      const statusA = (a.status || '').trim().toLowerCase();
      const statusB = (b.status || '').trim().toLowerCase();

      const isFinishedA = statusA === 'exam finished';
      const isFinishedB = statusB === 'exam finished';

      // Push finished exams to the very end
      if (isFinishedA !== isFinishedB) {
        return isFinishedA ? 1 : -1;
      }

      // Within active/upcoming exams, prioritize "On Going" before "Scheduled"
      const isOngoingA = statusA === 'on going';
      const isOngoingB = statusB === 'on going';
      if (isOngoingA !== isOngoingB) {
        return isOngoingA ? -1 : 1;
      }

      const timeA = getExamStartTimestamp(a);
      const timeB = getExamStartTimestamp(b);

      if (!isFinishedA) {
        // Upcoming / On Going: nearest date & time first, later dates toward the end
        if (timeA !== timeB) return timeA - timeB;
      } else {
        // Finished: most recently finished first, oldest finished at the very last
        if (timeA !== timeB) return timeB - timeA;
      }

      return String(a.exam_id || '').localeCompare(String(b.exam_id || ''));
    });
  }, [exams]);

  // Calculate total pages
  const totalPages = Math.ceil(sortedExams.length / ITEMS_PER_PAGE);

  // Reset pagination when filtered results change
  useEffect(() => {
    setCurrentPage(1);
  }, [exams]);

  // Keep current page within valid range
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Calculate current page data
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = Math.min(
    startIndex + ITEMS_PER_PAGE,
    sortedExams.length
  );

  const currentExams = sortedExams.slice(startIndex, endIndex);

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

  // Loading State
  if (loading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
            <RefreshCw className="w-5 h-5 text-[#1464F6] animate-spin" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700">
              Loading examinations
            </h3>

            <p className="text-xs text-slate-400 mt-0.5">
              Please wait while we fetch examination schedules...
            </p>
          </div>
        </div>

        {/* Skeleton Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <div
              key={index}
              className="p-5 rounded-xl border border-slate-200 bg-white animate-pulse"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="h-5 w-32 bg-slate-200 rounded-md" />
                <div className="h-5 w-20 bg-slate-200 rounded-full" />
              </div>

              <div className="h-5 w-48 max-w-full bg-slate-200 rounded mt-5" />

              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-4">
                <div className="h-3 w-24 bg-slate-100 rounded" />
                <div className="h-3 w-20 bg-slate-100 rounded" />
                <div className="h-3 w-20 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-14 px-5 rounded-xl border border-red-200 bg-red-50/50">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-100 mb-4">
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>

        <h3 className="text-base font-bold text-slate-800">
          Unable to load examinations
        </h3>

        <p className="text-sm text-slate-500 mt-2 max-w-md">
          {typeof error === 'string'
            ? error
            : 'Something went wrong while fetching examination schedules.'}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1464F6] text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    );
  }

  // Empty State
  if (sortedExams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-14 px-5 rounded-xl border border-dashed border-slate-200 bg-white">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 mb-4">
          <ClipboardList className="w-7 h-7 text-slate-400" />
        </div>

        <h3 className="text-base font-bold text-slate-800">
          No examinations found
        </h3>

        <p className="text-sm text-slate-500 mt-2">
          No examinations match your selected department.
        </p>

        {onResetFilter && (
          <button
            type="button"
            onClick={onResetFilter}
            className="mt-4 text-[#1464F6] font-semibold text-sm hover:underline cursor-pointer"
          >
            View all departments
          </button>
        )}
      </div>
    );
  }

  // Success State
  return (
    <div className="space-y-6">
      {/* Examination Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentExams.map((exam, idx) => (
          <div
            key={`${exam.exam_id}-${idx}`}
            className="group p-5 rounded-xl border border-slate-200/80 bg-[#F4F7FE]/50 hover:bg-white hover:shadow-lg hover:border-blue-200 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Exam Code and Status */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#1464F6] bg-blue-50 px-2.5 py-1 rounded-md">
                  {exam.exam_id} • {exam.department}
                </span>

                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    exam.status === 'Scheduled'
                      ? 'bg-amber-50 text-amber-700'
                      : exam.status === 'On Going'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {exam.status}
                </span>
              </div>

              {/* Subject */}
              <h3 className="font-bold text-slate-800 text-base mt-3 group-hover:text-[#1464F6] transition-colors">
                {exam.subject}
              </h3>
            </div>

            {/* Exam Details */}
            <div className="mt-4 pt-3 border-t border-slate-200/70 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {exam.date}
              </span>

              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {exam.time_slot}
              </span>

              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {exam.room}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-5">
          {/* Results Information */}
          <p className="text-sm text-slate-500">
            Showing{' '}
            <span className="font-semibold text-slate-700">
              {startIndex + 1}–{endIndex}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-700">
              {sortedExams.length}
            </span>{' '}
            examinations
          </p>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1.5">
            {/* Previous Button */}
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center gap-1 px-3 h-9 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />

              <span className="hidden sm:inline">
                Previous
              </span>
            </button>

            {/* Page Numbers */}
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
                  aria-current={
                    currentPage === page ? 'page' : undefined
                  }
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-[#1464F6] text-white shadow-sm shadow-blue-200'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-[#1464F6] hover:border-blue-200'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center gap-1 px-3 h-9 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
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

      {/* Single Page Information */}
      {totalPages === 1 && (
        <div className="text-sm text-slate-500 border-t border-slate-200 pt-4">
          Showing{' '}
          <span className="font-semibold text-slate-700">
            {sortedExams.length}
          </span>{' '}
          examinations
        </div>
      )}
    </div>
  );
}