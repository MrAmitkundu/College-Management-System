import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddFacultyModal({ isOpen, onClose, onAddFaculty }) {
  const [formData, setFormData] = useState({
    name: '',
    dept: 'Computer Science',
    role: 'Assistant Professor',
    email: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    onAddFaculty({
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
    });

    setFormData({
      name: '',
      dept: 'Computer Science',
      role: 'Assistant Professor',
      email: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Add New Faculty</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name (with Title) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Ritwik Sen"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department
              </label>
              <select
                value={formData.dept}
                onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Electronics">Electronics</option>
                <option value="Commerce">Commerce</option>
                <option value="Mechanical">Mechanical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Designation
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white"
              >
                <option value="Professor & HOD">Professor & HOD</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Official Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. ritwik@bbcollege.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#109E62] hover:bg-emerald-700 rounded-xl shadow-sm cursor-pointer"
            >
              Save Faculty
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}