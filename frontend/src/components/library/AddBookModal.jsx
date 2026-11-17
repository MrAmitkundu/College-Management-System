import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddBookModal({ isOpen, onClose, onAddBook }) {
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    category: 'Programming',
    status: 'Available',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.isbn.trim() || !formData.title.trim() || !formData.author.trim()) return;

    onAddBook({
      ...formData,
      isbn: formData.isbn.trim(),
      title: formData.title.trim(),
      author: formData.author.trim(),
    });

    setFormData({
      isbn: '',
      title: '',
      author: '',
      category: 'Programming',
      status: 'Available',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Add New Book to Catalog</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Book Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Clean Code"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Author Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Robert C. Martin"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ISBN Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 978-0132350884"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:bg-white"
              >
                <option value="Programming">Programming</option>
                <option value="Data Science">Data Science</option>
                <option value="CS Core">CS Core</option>
                <option value="Electronics">Electronics</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Commerce">Commerce</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#7C4DFF] hover:bg-purple-700 rounded-xl shadow-sm cursor-pointer"
            >
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}