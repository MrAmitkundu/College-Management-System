import React, { useState } from 'react';
import { Filter, Plus } from 'lucide-react';
import { facultyList as initialFaculty } from '../data/mockData';
import FacultyFilterBar from '../components/faculty/FacultyFilterBar';
import FacultyGrid from '../components/faculty/FacultyGrid';
import AddFacultyModal from '../components/faculty/AddFacultyModal';

export default function FacultyView() {
  const [faculty, setFaculty] = useState(initialFaculty);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extract unique departments and roles dynamically
  const departments = ['All', ...new Set(faculty.map((f) => f.dept))];
  const roles = ['All', ...new Set(faculty.map((f) => f.role))];

  const filteredFaculty = faculty.filter((fac) => {
    const matchesSearch =
      fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || fac.dept === selectedDept;
    const matchesRole = selectedRole === 'All' || fac.role === selectedRole;

    return matchesSearch && matchesDept && matchesRole;
  });

  const handleAddFaculty = (newFacultyData) => {
    const nextNumber = 201 + faculty.length;
    const createdFaculty = {
      id: `FAC-${nextNumber}`,
      ...newFacultyData,
    };
    setFaculty([createdFaculty, ...faculty]);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDept('All');
    setSelectedRole('All');
  };

  const hasActiveFilters = searchQuery !== '' || selectedDept !== 'All' || selectedRole !== 'All';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      {/* Header & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Faculty Members</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {filteredFaculty.length} of {faculty.length} teaching staff & department heads
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer ${
              showFilters || hasActiveFilters
                ? 'bg-emerald-50 text-[#109E62] border border-emerald-200'
                : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#109E62]" />}
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#109E62] hover:bg-emerald-700 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Faculty
          </button>
        </div>
      </div>

      {/* Collapsible Filter Bar */}
      {showFilters && (
        <FacultyFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          departments={departments}
          roles={roles}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {/* Faculty Cards Grid */}
      <FacultyGrid faculty={filteredFaculty} onResetFilters={resetFilters} />

      {/* Add Faculty Modal */}
      <AddFacultyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddFaculty={handleAddFaculty}
      />
    </div>
  );
}