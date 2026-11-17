import React from 'react';

export default function TransactionTable({ transactions, onResetFilters }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
            <th className="py-3 px-4">Txn ID</th>
            <th className="py-3 px-4">Student</th>
            <th className="py-3 px-4">Payment Type</th>
            <th className="py-3 px-4">Amount</th>
            <th className="py-3 px-4">Date</th>
            <th className="py-3 px-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {transactions.length > 0 ? (
            transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-slate-50/80 transition">
                <td className="py-3.5 px-4 font-semibold text-[#F58A07]">{txn.id}</td>
                <td className="py-3.5 px-4 font-medium text-slate-800">{txn.student}</td>
                <td className="py-3.5 px-4 text-slate-600">{txn.type}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">{txn.amount}</td>
                <td className="py-3.5 px-4 text-slate-500 text-xs">{txn.date}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      txn.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-10 text-center text-sm text-slate-500">
                No transactions match your search or status filter.{' '}
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="text-[#F58A07] font-semibold hover:underline cursor-pointer"
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