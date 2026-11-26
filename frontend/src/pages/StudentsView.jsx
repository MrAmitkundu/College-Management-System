
import React, { useEffect, useState } from 'react';
import { Filter, Plus } from 'lucide-react';

import StudentFilterBar from '../components/students/StudentFilterBar';
import StudentTable from '../components/students/StudentTable';
import AddStudentModal from '../components/students/AddStudentModal';

// Django API endpoint
const API_URL = 'http://127.0.0.1:8000/api/student/';

export default function StudentsView() {
  // Student records received from Django
  const [students, setStudents] = useState([]);

  // API loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Existing UI states
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch students from Django
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      // Supports normal and paginated DRF responses
      const studentData = Array.isArray(data)
        ? data
        : data.results || [];

      setStudents(studentData);
    } catch (err) {
      console.error('Student API error:', err);

      setError(
        'Unable to load students. Check whether Django is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch students when page opens
  useEffect(() => {
    fetchStudents();
  }, []);

  // Department options from actual API records
  const departments = [
    'All',
    ...new Set(students.map((student) => student.dept).filter(Boolean)),
  ];

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
      selectedDept === 'All' || stu.dept === selectedDept;

    return matchesSearch && matchesDept;
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
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer ${
              showFilters || hasActiveFilters
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
      />

      {/* Add student modal */}
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddStudent={() => {
          // Refresh the table after a student is added
          fetchStudents();
        }}
      />
    </div>
  );
}
