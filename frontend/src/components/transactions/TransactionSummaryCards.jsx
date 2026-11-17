import React from 'react';
import { ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';

export default function TransactionSummaryCards({ totalCount }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Total Collected (This Month)</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">₹4,85,200</h3>
        </div>
        <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Pending Fee Dues</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">₹55,500</h3>
        </div>
        <div className="w-11 h-11 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Completed Transactions</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalCount}</h3>
        </div>
        <div className="w-11 h-11 rounded-full bg-orange-50 text-[#F58A07] flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}