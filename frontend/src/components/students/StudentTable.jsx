import React, { useState, useEffect } from 'react';
import EditStudentModal from './EditStudentModal';
import PromoteStudentModal from './PromoteStudentModal';
import ApproveFeeModal from './ApproveFeeModal';

function getSemesterNumber(semester) {
  if (semester === null || semester === undefined) return 0;
  const match = String(semester).match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export default function StudentTable({
  students = [],
  onResetFilters,
  onSaveStudent,
  onPromoteStudent,
  onApproveFee,
  onRevertPromotion,
  loading = false,
  error = '',
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [editingStudent, setEditingStudent] = useState(null);
  const [promotingStudent, setPromotingStudent] = useState(null);
  const [feeStudent, setFeeStudent] = useState(null);

  const totalStudents = students.length;
  const totalPages = Math.ceil(totalStudents / rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [students, rowsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalStudents);
  const currentStudents = students.slice(startIndex, endIndex);

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

  const getStatusBadge = (status) => {
    if (!status) return <span className="text-slate-600">—</span>;

    const normalizedStatus = status.trim().toLowerCase();

    if (normalizedStatus === 'active') {
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          {status}
        </span>
      );
    }

    if (normalizedStatus === 'pending fee') {
      return (
        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
          {status}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
        {status}
      </span>
    );
  };

  const isActiveStatus = (status) =>
    status && status.trim().toLowerCase() === 'active';

  const isPendingFee = (status) =>
    status && status.trim().toLowerCase() === 'pending fee';

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
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
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan={11} className="py-10 text-center text-slate-500">
                  Loading students...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={11} className="py-10 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : currentStudents.length > 0 ? (
              currentStudents.map((stu) => {
                const canPromote =
                  isActiveStatus(stu.status) && getSemesterNumber(stu.semester) < 8;
                const feePending = isPendingFee(stu.status);

                return (
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

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(stu.status)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingStudent(stu)}
                          title="Edit student details"
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          disabled={!canPromote}
                          onClick={() => canPromote && setPromotingStudent(stu)}
                          title={
                            getSemesterNumber(stu.semester) >= 8
                              ? 'Maximum semester (8th) reached'
                              : !isActiveStatus(stu.status)
                              ? 'Only Active students can be promoted'
                              : 'Promote to next semester'
                          }
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                            canPromote
                              ? 'border border-[#1464F6]/30 bg-[#1464F6]/5 text-[#1464F6] hover:bg-[#1464F6]/10 cursor-pointer'
                              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                          }`}
                        >
                          Promote
                        </button>

                        <button
                          type="button"
                          disabled={!feePending}
                          onClick={() => feePending && setFeeStudent(stu)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                            feePending
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer'
                              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                          }`}
                        >
                          Approve Fee
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={11} className="py-10 text-center text-slate-500">
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

      {!loading && !error && totalStudents > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 px-4 py-4">
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

            <button
              type="button"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

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

      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSave={onSaveStudent}
        />
      )}

      {promotingStudent && (
        <PromoteStudentModal
          student={promotingStudent}
          onClose={() => setPromotingStudent(null)}
          onConfirm={onPromoteStudent}
        />
      )}

      {feeStudent && (
        <ApproveFeeModal
          student={feeStudent}
          onClose={() => setFeeStudent(null)}
          onApprove={onApproveFee}
          onRevertSemester={onRevertPromotion}
        />
      )}
    </div>
  );
}