import React, { useState } from 'react';

export default function EditStudentModal({ student, onClose, onSave }) {
  const [form, setForm] = useState({
    student_name: student.student_name || '',
    guardian_name: student.guardian_name || '',
    date_of_birth: student.date_of_birth || '',
    phone_number: student.phone_number || '',
    email: student.email || '',
    blood_group: student.blood_group || '',
    department: student.department || '',
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      const payload = {
        ...form,
        date_of_birth: form.date_of_birth ? form.date_of_birth : null,
      };
      await onSave?.(student.student_id, payload);
      onClose();
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to update student details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900">Edit Student</h3>
        <p className="mt-1 text-xs text-slate-500">
          Student ID: <span className="font-semibold">{student.student_id}</span> ·
          Semester: <span className="font-semibold">{student.semester}</span> ·
          Status: <span className="font-semibold">{student.status}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-sm">
          <div>
            <label className="block font-medium text-slate-700">Full Name</label>
            <input
              name="student_name"
              value={form.student_name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700">Guardian Name</label>
            <input
              name="guardian_name"
              value={form.guardian_name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700">Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700">Blood Group</label>
              <input
                name="blood_group"
                value={form.blood_group}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700">Phone</label>
              <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700">Department</label>
            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          {errorMsg && (
            <p className="rounded-lg bg-red-50 p-2.5 text-xs font-medium text-red-700">
              {errorMsg}
            </p>
          )}

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#1464F6] px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}