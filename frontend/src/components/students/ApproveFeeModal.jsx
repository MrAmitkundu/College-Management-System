import React, { useState } from 'react';

export default function ApproveFeeModal({
  student,
  onClose,
  onApprove,
  onRevertSemester,
}) {
  const [transactionId, setTransactionId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [canRevert, setCanRevert] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApprove = async (e) => {
    e.preventDefault();
    if (!transactionId.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setCanRevert(false);

    try {
      const result = await onApprove?.(student, transactionId.trim());
      if (result?.ok) {
        onClose();
      } else {
        setErrorMsg(
          result?.reason ||
            'Unable to approve payment. Transaction verification failed.'
        );
        setCanRevert(true);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Verification failed.');
      setCanRevert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRevert = async () => {
    setLoading(true);
    try {
      await onRevertSemester?.(student);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900">
          Approve Pending Fee
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Student: <span className="font-semibold">{student.student_name}</span>{' '}
          (Semester {student.semester})
        </p>

        <form onSubmit={handleApprove} className="mt-4 space-y-3 text-sm">
          <div>
            <label className="block font-medium text-slate-700">
              Transaction ID
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#1464F6]"
              required
            />
          </div>

          {errorMsg && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <p className="font-semibold">{errorMsg}</p>
              <button
                type="button"
                onClick={handleRevert}
                disabled={loading || !canRevert}
                className="mt-2.5 rounded-md bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                Revert to Previous Semester &amp; Set Active
              </button>
            </div>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading || !transactionId.trim()}
              className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Verifying...' : 'Approve'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}