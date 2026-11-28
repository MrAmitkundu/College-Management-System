import React, { useState } from 'react';

function toOrdinal(num) {
  const n = Math.min(8, Math.max(1, Number(num) || 1));
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
}

function formatNextSemester(currentSem) {
  const match = String(currentSem || '').match(/\d+/);
  const currentNum = match ? Number(match[0]) : 0;
  const nextNum = Math.min(8, currentNum + 1);
  return toOrdinal(nextNum);
}

export default function PromoteStudentModal({ student, onClose, onConfirm }) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const nextSem = formatNextSemester(student.semester);

  const handleYes = async () => {
    setSubmitting(true);
    setErrorMsg('');
    try {
      await onConfirm?.(student, nextSem);
      onClose();
    } catch (err) {
      setErrorMsg(err?.message || 'Could not promote student.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900">Promote Student</h3>
        <p className="mt-2 text-sm text-slate-600">
          Are you sure you want to promote{' '}
          <span className="font-semibold text-slate-900">
            {student.student_name}
          </span>{' '}
          from semester{' '}
          <span className="font-semibold text-slate-900">
            {student.semester}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-[#1464F6]">{nextSem}</span>?
          Status will be updated to{' '}
          <span className="font-semibold text-amber-700">Pending Fee</span>.
        </p>

        {errorMsg && (
          <p className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs font-medium text-red-700">
            {errorMsg}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2 text-sm">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            No, Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleYes}
            className="rounded-lg bg-[#1464F6] px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Promoting...' : 'Yes, Promote'}
          </button>
        </div>
      </div>
    </div>
  );
}