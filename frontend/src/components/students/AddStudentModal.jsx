import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const INITIAL_FORM = {
  student_name: '',
  guardian_name: '',
  date_of_birth: '',
  phone_number: '',
  email: '',
  blood_group: '',
  department: '',
  semester: '1st',
};

const inputClass = 'w-full px-3.5 py-2.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white';
const labelClass = 'block text-xs font-semibold text-slate-700 mb-1';

export default function AddStudentModal({ isOpen, onClose, onAddStudent, departments = [] }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData((current) => ({
        ...INITIAL_FORM,
        department: current.department || departments[0] || '',
      }));
      setErrorMessage('');
    }
  }, [isOpen, departments]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSaving(true);

    try {
      await onAddStudent({
        ...formData,
        student_name: formData.student_name.trim(),
        guardian_name: formData.guardian_name.trim(),
        phone_number: formData.phone_number.trim(),
        email: formData.email.trim(),
        blood_group: formData.blood_group.trim(),
        date_of_birth: formData.date_of_birth || null,
      });
      setFormData(INITIAL_FORM);
      onClose();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to add student. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Add New Student</h3>
            <p className="text-xs text-slate-500 mt-1">
              New admissions default to 1st Semester with Pending Fee status until verified.
            </p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close modal" className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className={labelClass}>Full Name *</label>
            <input name="student_name" type="text" required maxLength={100} autoFocus placeholder="Enter student's full name" value={formData.student_name} onChange={handleChange} className={inputClass} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Guardian Name</label>
              <input name="guardian_name" type="text" maxLength={100} placeholder="Enter guardian's name" value={formData.guardian_name} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Date of Birth</label>
              <input name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <input name="phone_number" type="tel" maxLength={15} placeholder="Enter phone number" value={formData.phone_number} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input name="email" type="email" maxLength={100} placeholder="student@example.com" value={formData.email} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Blood Group</label>
              <select name="blood_group" value={formData.blood_group} onChange={handleChange} className={inputClass}>
                <option value="">Select blood group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => <option key={group} value={group}>{group}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Department *</label>
              <select name="department" required value={formData.department} onChange={handleChange} className={inputClass}>
                <option value="">Select department</option>
                {departments.map((department) => <option key={department} value={department}>{department}</option>)}
              </select>
              {departments.length === 0 && <p className="mt-1 text-xs text-amber-600">No departments found in the student records.</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Admission Semester *</label>
            <select name="semester" required value={formData.semester} onChange={handleChange} className={inputClass}>
              {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map((semester) => (
                <option key={semester} value={semester}>
                  {semester} Semester {semester === '1st' ? '(Default)' : '(Lateral / Direct Entry)'}
                </option>
              ))}
            </select>
          </div>

          {errorMessage && <p role="alert" className="rounded-lg bg-red-50 border border-red-100 p-3 text-xs font-medium text-red-700">{errorMessage}</p>}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={saving || departments.length === 0} className="px-5 py-2 text-xs font-semibold text-white bg-[#1464F6] hover:bg-blue-700 rounded-xl shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? 'Saving...' : 'Save Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}