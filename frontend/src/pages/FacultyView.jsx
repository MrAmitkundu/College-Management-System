
import React, { useState, useMemo } from 'react';
import { Filter, Plus } from 'lucide-react';

import FacultyFilterBar from '../components/faculty/FacultyFilterBar';
import FacultyGrid from '../components/faculty/FacultyGrid';
import AddFacultyModal from '../components/faculty/AddFacultyModal';

import useFetchData from '../hooks/useFetchData';

// Django API endpoint
const API_URL = 'http://127.0.0.1:8000/api/faculty/';

export default function FacultyView() {
  // Fetch faculty from Django API
  const {
    data: faculty = [],
    loading,
    error,
    refetch: fetchFaculty,
  } = useFetchData(API_URL);

  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Locally added faculty (until connected to POST API)
  const [addedFaculty, setAddedFaculty] = useState([]);

  // Combine API faculty and locally added faculty
  const allFaculty = useMemo(() => {
    return [...addedFaculty, ...faculty];
  }, [addedFaculty, faculty]);


  // Extract unique departments
  const departments = useMemo(() => {
    return [
      'All',
      ...new Set(
        allFaculty
          .map((f) => f.department)
          .filter(Boolean)
      ),
    ];
  }, [allFaculty]);

  // Extract unique roles
  const roles = useMemo(() => {
    return [
      'All',
      ...new Set(
        allFaculty
          .map((f) => f.designation)
          .filter(Boolean)
      ),
    ];
  }, [allFaculty]);

  // Apply filters
  const filteredFaculty = useMemo(() => {
    return allFaculty.filter((fac) => {
      const name = String(fac.teacher_name || '').toLowerCase();
      const id = String(fac.faculty_id || '').toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        name.includes(query) || id.includes(query);

      const matchesDept =
        selectedDept === 'All' || fac.department === selectedDept;

      const matchesRole =
        selectedRole === 'All' || fac.designation === selectedRole;

      return matchesSearch && matchesDept && matchesRole;
    });
  }, [
    allFaculty,
    searchQuery,
    selectedDept,
    selectedRole,
  ]);



  // Add faculty locally
  const handleAddFaculty = (newFacultyData) => {
    const nextNumber = 201 + allFaculty.length;

    const createdFaculty = {
      id: `FAC-${nextNumber}`,
      ...newFacultyData,
    };

    setAddedFaculty((prev) => [createdFaculty, ...prev]);

    setIsModalOpen(false);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDept('All');
    setSelectedRole('All');
  };

  // Check active filters
  const hasActiveFilters =
    searchQuery !== '' ||
    selectedDept !== 'All' ||
    selectedRole !== 'All';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Faculty Members
          </h2>

          <p className="text-xs text-slate-500 mt-0.5">
            {loading
              ? 'Loading faculty records...'
              : `Showing ${filteredFaculty.length} of ${allFaculty.length} teaching staff & department heads`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">

          {/* Filter Button */}
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer ${
              showFilters || hasActiveFilters
                ? 'bg-emerald-50 text-[#109E62] border border-emerald-200'
                : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <Filter className="w-4 h-4" />

            Filter

            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#109E62]" />
            )}
          </button>

          {/* Add Faculty Button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#109E62] hover:bg-emerald-700 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Faculty
          </button>
        </div>
      </div>

      {/* Filter Bar */}
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

      {/* Faculty Grid */}
      <FacultyGrid
        faculty={filteredFaculty}
        loading={loading}
        error={error}
        onResetFilters={resetFilters}
        onRetry={fetchFaculty}
      />

      {/* Add Faculty Modal */}
      <AddFacultyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddFaculty={handleAddFaculty}
      />

    </div>
  );
}
