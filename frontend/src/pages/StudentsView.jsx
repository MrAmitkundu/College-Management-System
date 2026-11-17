import React, { useState } from 'react';
import { Filter, Plus } from 'lucide-react';
import { studentsList as initialStudents } from '../data/mockData';
import StudentFilterBar from '../components/students/StudentFilterBar';
import StudentTable from '../components/students/StudentTable';
import AddStudentModal from '../components/students/AddStudentModal';

export default function StudentsView() {
  const [students, setStudents] = useState(initialStudents);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const departments = ['All', ...new Set(students.map((s) => s.dept))];

  const filteredStudents = students.filter((stu) => {
    const matchesSearch =
      stu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || stu.dept === selectedDept;
    const matchesStatus = selectedStatus === 'All' || stu.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleAddStudent = (newStudentData) => {
    const nextNumber = 1001 + students.length;
    const createdStudent = {
      id: `STU-${nextNumber}`,
      ...newStudentData,
    };
    setStudents([createdStudent, ...students]);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDept('All');
    setSelectedStatus('All');
  };

  const hasActiveFilters = searchQuery !== '' || selectedDept !== 'All' || selectedStatus !== 'All';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      {/* Header & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Students Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {filteredStudents.length} of {students.length} enrolled students
          </p>
        </div>

        <div className="flex items-center gap-3">
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
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#1464F6]" />}
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1464F6] hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Student
          </button>
        </div>
      </div>

      {/* Filter Bar Component */}
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

      {/* Table Component */}
      <StudentTable students={filteredStudents} onResetFilters={resetFilters} />

      {/* Modal Component */}
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddStudent={handleAddStudent}
      />
    </div>
  );
}