
import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';

import ExamCardGrid from '../components/examinations/ExamCardGrid';
import ScheduleExamModal from '../components/examinations/ScheduleExamModal';

import useFetchData from '../hooks/useFetchData';

// Django API endpoint
const API_URL = 'http://127.0.0.1:8000/api/examination/';

export default function ExaminationsView() {
  // Fetch examinations from Django API
  const {
    data: exams = [],
    loading,
    error,
    refetch: fetchExams,
  } = useFetchData(API_URL);

  // UI states
  const [selectedDept, setSelectedDept] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Locally scheduled exams
  // These are temporary until POST API is connected
  const [scheduledExams, setScheduledExams] = useState([]);

  // Combine API exams and locally scheduled exams
  const allExams = useMemo(() => {
    return [...scheduledExams, ...exams];
  }, [scheduledExams, exams]);

  // Extract unique departments
  const departments = useMemo(() => {
    return [
      'All',
      ...new Set(
        allExams
          .map((exam) => exam.department)
          .filter(Boolean)
      ),
    ];
  }, [allExams]);

  // Filter examinations by department
  const filteredExams = useMemo(() => {
    if (selectedDept === 'All') {
      return allExams;
    }

    return allExams.filter(
      (exam) => exam.department === selectedDept
    );
  }, [allExams, selectedDept]);

  // Schedule examination locally
  const handleScheduleExam = (newExamData) => {
    const scheduledExam = {
      ...newExamData,
      status: 'Scheduled',
    };

    setScheduledExams((prev) => [
      scheduledExam,
      ...prev,
    ]);

    setIsModalOpen(false);
  };

  // Reset department filter
  const resetFilter = () => {
    setSelectedDept('All');
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">

      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">

        {/* Page Title */}
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Examination Schedule
          </h2>

          <p className="text-xs text-slate-500 mt-0.5">
            {loading
              ? 'Loading examination schedules...'
              : `Showing ${filteredExams.length} of ${allExams.length} semester papers & hall assignments`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'All'
                  ? 'All Departments'
                  : dept}
              </option>
            ))}
          </select>

          {/* Schedule Exam Button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1464F6] hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Schedule Exam
          </button>

        </div>
      </div>

      {/* Examination Cards */}
      <ExamCardGrid
        exams={filteredExams}
        loading={loading}
        error={error}
        onResetFilter={resetFilter}
        onRetry={fetchExams}
      />

      {/* Schedule Exam Modal */}
      <ScheduleExamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onScheduleExam={handleScheduleExam}
      />

    </div>
  );
}
