import React, { useEffect, useState } from 'react';
import { X, LoaderCircle } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';
const INITIAL_FORM = {
  name: '',
  dept: '',
  role: 'Assistant Professor',
  email: '',
};

function getErrorMessage(payload) {
  if (!payload) return 'Unable to save faculty. Please try again.';
  if (typeof payload.detail === 'string') return payload.detail;
  return Object.entries(payload)
    .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(' ') : messages}`)
    .join('\n') || 'Unable to save faculty. Please try again.';
}

export default function AddFacultyModal({ isOpen, onClose, onAddFaculty }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return undefined;

    const controller = new AbortController();
    const loadDepartments = async () => {
      setDepartmentsLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE}/departments/`, { signal: controller.signal });
        if (!response.ok) throw new Error('Unable to load departments from the database.');
        const result = await response.json();
        const names = Array.isArray(result)
          ? result.map((item) => typeof item === 'string' ? item : item.department_name).filter(Boolean)
          : [];
        setDepartments(names);
        setFormData((current) => ({
          ...current,
          dept: names.includes(current.dept) ? current.dept : (names[0] || ''),
        }));
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || 'Unable to load departments.');
      } finally {
        if (!controller.signal.aborted) setDepartmentsLoading(false);
      }
    };

    loadDepartments();
    return () => controller.abort();
  }, [isOpen]);

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleClose = () => {
    if (saving) return;
    setError('');
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    if (!name || !email || !formData.dept) return;

    setSaving(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/faculty/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacher_name: name,
          department: formData.dept,
          designation: formData.role,
          email,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(getErrorMessage(payload));

      await onAddFaculty(payload);
      setFormData(INITIAL_FORM);
      onClose();
    } catch (err) {
      setError(err.message || 'Unable to save faculty. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full px-3.5 py-2.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white disabled:opacity-60';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Add New Faculty</h3>
          <button type="button" onClick={handleClose} disabled={saving} aria-label="Close modal" className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="faculty-name" className="block text-xs font-semibold text-slate-700 mb-1">Full Name (with Title) *</label>
            <input id="faculty-name" type="text" required maxLength={100} placeholder="e.g. Dr. Ritwik Sen" value={formData.name} onChange={(e) => updateField('name', e.target.value)} className={inputClass} disabled={saving} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="faculty-department" className="block text-xs font-semibold text-slate-700 mb-1">Department *</label>
              <select id="faculty-department" required value={formData.dept} onChange={(e) => updateField('dept', e.target.value)} className={inputClass} disabled={saving || departmentsLoading || departments.length === 0}>
                {departments.length === 0 && <option value="">{departmentsLoading ? 'Loading...' : 'No departments found'}</option>}
                {departments.map((department) => <option key={department} value={department}>{department}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="faculty-designation" className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
              <select id="faculty-designation" value={formData.role} onChange={(e) => updateField('role', e.target.value)} className={inputClass} disabled={saving}>
                <option value="Professor & HOD">Professor &amp; HOD</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="faculty-email" className="block text-xs font-semibold text-slate-700 mb-1">Official Email Address *</label>
            <input id="faculty-email" type="email" required maxLength={100} placeholder="e.g. ritwik@bbcollege.edu" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className={inputClass} disabled={saving} />
          </div>

          {error && <div role="alert" className="whitespace-pre-line rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">{error}</div>}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={handleClose} disabled={saving} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={saving || departmentsLoading || departments.length === 0} className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#109E62] hover:bg-emerald-700 rounded-xl shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
              {saving && <LoaderCircle className="w-4 h-4 animate-spin" />}
              {saving ? 'Saving...' : 'Save Faculty'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
