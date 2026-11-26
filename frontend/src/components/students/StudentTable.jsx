
import React, { useState, useEffect } from 'react';

export default function StudentTable({
  students = [],
  onResetFilters,
  loading = false,
  error = '',
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Calculate pagination values
  const totalStudents = students.length;
  const totalPages = Math.ceil(totalStudents / rowsPerPage);

  // Reset page when the student list or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [students, rowsPerPage]);

  // Ensure current page remains valid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Get students for the current page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalStudents);

  const currentStudents = students.slice(startIndex, endIndex);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(
      totalPages,
      startPage + maxVisiblePages - 1
    );

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }

    return pages;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

      {/* Student Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">

          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
              <th className="py-3 px-4">Student ID</th>
              <th className="py-3 px-4">Full Name</th>
              <th className="py-3 px-4">Guardian Name</th>
              <th className="py-3 px-4">Date of Birth</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Blood Group</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Semester</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">

            {loading ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-slate-500">
                  Loading students...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : currentStudents.length > 0 ? (
              currentStudents.map((stu) => (
                <tr
                  key={stu.student_id}
                  className="hover:bg-slate-50/80 transition"
                >
                  <td className="py-3.5 px-4 font-semibold text-[#1464F6]">
                    {stu.student_id}
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {stu.student_name || '—'}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    {stu.guardian_name || '—'}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    {stu.date_of_birth || '—'}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    {stu.phone_number || '—'}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    {stu.email || '—'}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    {stu.blood_group || '—'}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    {stu.department || '—'}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    {stu.semester || '—'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-10 text-center text-slate-500">
                  No students found.{' '}

                  {onResetFilters && (
                    <button
                      type="button"
                      onClick={onResetFilters}
                      className="text-[#1464F6] font-semibold hover:underline cursor-pointer"
                    >
                      Clear filters
                    </button>
                  )}
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && !error && totalStudents > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 px-4 py-4">

          {/* Showing records */}
          <div className="text-sm text-slate-500">
            Showing{' '}
            <span className="font-semibold text-slate-700">
              {startIndex + 1}–{endIndex}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-700">
              {totalStudents}
            </span>{' '}
            students
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">

            {/* Rows per page */}
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-[#1464F6]"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>

            {/* Previous Button */}
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`min-w-9 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  currentPage === page
                    ? 'border-[#1464F6] bg-[#1464F6] text-white'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
