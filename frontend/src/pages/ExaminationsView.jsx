import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { examinationsList as initialExams } from '../data/mockData';
import ExamCardGrid from '../components/examinations/ExamCardGrid';
import ScheduleExamModal from '../components/examinations/ScheduleExamModal';

export default function ExaminationsView() {
  const [exams, setExams] = useState(initialExams);
  const [selectedDept, setSelectedDept] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const departments = ['All', ...new Set(exams.map((e) => e.dept))];
  const filteredExams =
    selectedDept === 'All' ? exams : exams.filter((e) => e.dept === selectedDept);

  const handleScheduleExam = (newExamData) => {
    setExams([{ ...newExamData, status: 'Scheduled' }, ...exams]);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Examination Schedule</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {filteredExams.length} of {exams.length} semester papers & hall assignments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/70 rounded-xl focus:outline-none cursor-pointer"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'All' ? 'All Departments' : dept}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1464F6] hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Schedule Exam
          </button>
        </div>
      </div>

      {/* Exam Cards Grid */}
      <ExamCardGrid exams={filteredExams} onResetFilter={() => setSelectedDept('All')} />

      {/* Schedule Exam Modal */}
      <ScheduleExamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onScheduleExam={handleScheduleExam}
      />
    </div>
  );
}