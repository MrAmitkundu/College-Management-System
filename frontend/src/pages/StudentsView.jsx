import React, { useState } from 'react';
import { Filter, Plus } from 'lucide-react';

import StudentFilterBar from '../components/students/StudentFilterBar';
import StudentTable from '../components/students/StudentTable';
import AddStudentModal from '../components/students/AddStudentModal';

import useFetchData from "../hooks/useFetchData";


// Django API endpoint
const API_URL = 'http://127.0.0.1:8000/api/student/';
const DEPARTMENTS_API_URL = 'http://127.0.0.1:8000/api/departments/';

export default function StudentsView() {

  const {
    data: students,
    loading,
    error,
    refetch: fetchStudents
  } = useFetchData(API_URL);

  // Existing UI states
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  // Department choices are loaded from distinct department values in the database.
  React.useEffect(() => {
    fetch(DEPARTMENTS_API_URL)
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load departments');
        return response.json();
      })
      .then((data) => setDepartmentOptions(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Department API error:', err));
  }, []);

  const departments = ['All', ...departmentOptions];

  // Search and department filtering
  const filteredStudents = students.filter((stu) => {
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      String(stu.student_name || '')
        .toLowerCase()
        .includes(search) ||
      String(stu.student_id || '')
        .toLowerCase()
        .includes(search);

    const matchesDept =
      selectedDept === 'All' || stu.department === selectedDept;
    const matchesStatus =
      selectedStatus === 'All' || stu.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDept('All');
    setSelectedStatus('All');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedDept !== 'All' ||
    selectedStatus !== 'All';

  // Create a student in MySQL through Django. The backend forces Pending Fee status.
  const handleAddStudent = async (studentData) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data?.detail || Object.entries(data || {})
        .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
        .join(' | ');
      throw new Error(message || 'Failed to add student.');
    }
    await fetchStudents();
    return data;
  };

  // Save edited student details
  const handleSaveStudent = async (studentId, formData) => {
    const res = await fetch(`${API_URL}${encodeURIComponent(studentId)}/edit/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.detail || JSON.stringify(data) || 'Failed to update student');
    }
    await fetchStudents();
  };

  // Promote student to next semester (status -> Pending Fee)
  const handlePromoteStudent = async (student) => {
    const res = await fetch(`${API_URL}${encodeURIComponent(student.student_id)}/promote/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.detail || 'Failed to promote student');
    }
    await fetchStudents();
  };

  // Verify transaction ID and approve pending fee
  const handleApproveFee = async (student, transactionId) => {
    const res = await fetch(`${API_URL}${encodeURIComponent(student.student_id)}/approve-fee/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction_id: transactionId }),
    });
    const data = await res.json();
    if (data?.ok) {
      await fetchStudents();
    }
    return data;
  };

  // Revert student back to previous semester and set status Active
  const handleRevertPromotion = async (student) => {
    const res = await fetch(`${API_URL}${encodeURIComponent(student.student_id)}/revert-semester/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.detail || 'Failed to revert semester');
    }
    await fetchStudents();
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Students Directory
          </h2>

          <p className="text-xs text-slate-500 mt-0.5">
            Total No of students :  {filteredStudents.length}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter button */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer ${showFilters || hasActiveFilters
              ? 'bg-blue-50 text-[#1464F6] border border-blue-200'
              : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }`}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>

          {/* Refresh API */}
          <button
            type="button"
            onClick={fetchStudents}
            disabled={loading}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>

          {/* Add student modal */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1464F6] hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Student
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <StudentFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          departments={departments}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {/* Student table */}
      <StudentTable
        students={filteredStudents}
        loading={loading}
        error={error}
        onResetFilters={resetFilters}
        onSaveStudent={handleSaveStudent}
        onPromoteStudent={handlePromoteStudent}
        onApproveFee={handleApproveFee}
        onRevertPromotion={handleRevertPromotion}
      />

      {/* Add student modal */}
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        departments={departmentOptions}
        onAddStudent={handleAddStudent}
      />
    </div>
  );
}