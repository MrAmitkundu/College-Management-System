import React, { useState, useMemo, useEffect } from 'react';
import { Plus } from 'lucide-react';

import ExamCardGrid from '../components/examinations/ExamCardGrid';
import ScheduleExamModal from '../components/examinations/ScheduleExamModal';
import useFetchData from '../hooks/useFetchData';

const API_URL = 'http://127.0.0.1:8000/api/examination/';

function getApiError(payload, fallback) {
  if (!payload) return fallback;
  if (payload.detail) return payload.detail;
  return Object.entries(payload)
    .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
    .join(' ') || fallback;
}

export default function ExaminationsView() {
  const {
    data: exams = [],
    loading,
    error,
    refetch: fetchExams,
  } = useFetchData(API_URL);

  const [selectedDept, setSelectedDept] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Refresh server-calculated statuses regularly so cards change from
  // Scheduled -> On Going -> Exam Finished without a manual page refresh.
  useEffect(() => {
    const intervalId = window.setInterval(() => fetchExams(), 30_000);
    return () => window.clearInterval(intervalId);
  }, [fetchExams]);

  const departments = useMemo(() => [
    'All',
    ...new Set(exams.map((exam) => exam.department).filter(Boolean)),
  ], [exams]);

  const filteredExams = useMemo(() => {
    if (selectedDept === 'All') return exams;
    return exams.filter((exam) => exam.department === selectedDept);
  }, [exams, selectedDept]);

  const handleScheduleExam = async (examData) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(examData),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(getApiError(result, 'Unable to save the examination.'));
    }

    await fetchExams();
    setSelectedDept('All');
  };

  const resetFilter = () => setSelectedDept('All');

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Examination Schedule</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {loading
              ? 'Loading examination schedules...'
              : `Showing ${filteredExams.length} of ${exams.length} semester papers & hall assignments`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer">
            {departments.map((department) => <option key={department} value={department}>{department === 'All' ? 'All Departments' : department}</option>)}
          </select>

          <button type="button" onClick={() => setIsModalOpen(true)} className="px-4 py-2 text-xs font-semibold text-white bg-[#1464F6] hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer">
            <Plus className="w-4 h-4" />
            Schedule Exam
          </button>
        </div>
      </div>

      <ExamCardGrid
        exams={filteredExams}
        loading={loading}
        error={error}
        onResetFilter={resetFilter}
        onRetry={fetchExams}
      />

      <ScheduleExamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onScheduleExam={handleScheduleExam}
      />
    </div>
  );
}
