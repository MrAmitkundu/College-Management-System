import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function PostNoticeModal({ isOpen, onClose, onPublishNotice }) {
  const [formData, setFormData] = useState({
    text: '',
    barColor: 'bg-orange-500',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;

    onPublishNotice({
      text: formData.text.trim(),
      barColor: formData.barColor,
    });

    setFormData({ text: '', barColor: 'bg-orange-500' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Post New Notice</h3>
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
              Announcement Text *
            </label>
            <textarea
              rows="3"
              required
              placeholder="Enter notice details..."
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Priority / Tag Color
            </label>
            <select
              value={formData.barColor}
              onChange={(e) => setFormData({ ...formData, barColor: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
            >
              <option value="bg-orange-500">Urgent (Orange)</option>
              <option value="bg-amber-400">Examinations (Amber)</option>
              <option value="bg-emerald-500">Library / Academic (Green)</option>
              <option value="bg-indigo-500">General Event (Indigo)</option>
            </select>
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
              className="px-5 py-2 text-xs font-semibold text-white bg-[#1464F6] hover:bg-blue-700 rounded-xl shadow-sm cursor-pointer"
            >
              Publish Notice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}