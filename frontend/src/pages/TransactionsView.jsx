import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { transactionsList as initialTransactions } from '../data/mockData';
import TransactionSummaryCards from '../components/transactions/TransactionSummaryCards';
import TransactionTable from '../components/transactions/TransactionTable';
import AddTransactionModal from '../components/transactions/AddTransactionModal';

export default function TransactionsView() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTxns = transactions.filter((txn) => {
    const matchesSearch =
      txn.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || txn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddTransaction = (newTxnData) => {
    const newTxn = {
      id: `TXN-${501 + transactions.length}`,
      ...newTxnData,
      date: 'Nov 17, 2026',
    };
    setTransactions([newTxn, ...transactions]);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
  };

  return (
    <div className="space-y-6">
      <TransactionSummaryCards totalCount={transactions.length} />

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Fee & Library Transactions</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Track student fee receipts, exam fees, and library fines
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID or student..."
                className="pl-8 pr-3 py-2 bg-[#F4F7FE] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <Filter className="w-3.5 h-3.5 text-slate-500 ml-2" />
              {['All', 'Paid', 'Pending'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    statusFilter === status
                      ? 'bg-white text-slate-800 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#F58A07] hover:bg-amber-600 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Record Transaction
            </button>
          </div>
        </div>

        <TransactionTable transactions={filteredTxns} onResetFilters={resetFilters} />
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
}