import React from 'react';

export default function LibraryTable({ books, onToggleStatus, onResetFilters }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
            <th className="py-3 px-4">ISBN</th>
            <th className="py-3 px-4">Book Title</th>
            <th className="py-3 px-4">Author</th>
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4">Availability</th>
            <th className="py-3 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {books.length > 0 ? (
            books.map((book) => (
              <tr key={book.isbn} className="hover:bg-slate-50/80 transition">
                <td className="py-3.5 px-4 font-mono text-xs text-slate-500">{book.isbn}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">{book.title}</td>
                <td className="py-3.5 px-4 text-slate-600">{book.author}</td>
                <td className="py-3.5 px-4 text-slate-600">{book.category}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      book.status === 'Available'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-orange-50 text-orange-700'
                    }`}
                  >
                    {book.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(book.isbn)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      book.status === 'Available'
                        ? 'bg-purple-50 text-[#7C4DFF] hover:bg-purple-100'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {book.status === 'Available' ? 'Issue Book' : 'Return'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-10 text-center text-sm text-slate-500">
                No books match your selected filters.{' '}
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="text-[#7C4DFF] font-semibold hover:underline cursor-pointer"
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