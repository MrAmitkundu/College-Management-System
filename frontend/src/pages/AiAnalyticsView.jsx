import React, { useState, useEffect } from 'react';
import { Search, UserCheck, Building2, Sparkles } from 'lucide-react';
import {
    MOCK_STUDENTS,
    getCollegeAiSummary,
    getStudentAiAnalytics
} from '../services/aiAnalyticsService';
import CollegeOverviewCards from '../components/ai/CollegeOverviewCards';
import PlacementPredictor from '../components/ai/PlacementPredictor';
import AttendancePredictor from '../components/ai/AttendancePredictor';
import MarksPredictor from '../components/ai/MarksPredictor';

export default function AiAnalyticsView() {
    const [collegeData, setCollegeData] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState(MOCK_STUDENTS[0].id);
    const [studentAnalytics, setStudentAnalytics] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('college'); // 'college' | 'student'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            const summary = await getCollegeAiSummary();
            const student = await getStudentAiAnalytics(selectedStudentId);
            setCollegeData(summary);
            setStudentAnalytics(student);
            setLoading(false);
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchStudent = async () => {
            const student = await getStudentAiAnalytics(selectedStudentId);
            setStudentAnalytics(student);
        };
        if (selectedStudentId) fetchStudent();
    }, [selectedStudentId]);

    const filteredStudents = MOCK_STUDENTS.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center text-xs font-medium text-slate-500">
                Loading AI & ML Predictive Models...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Main Container matching ExaminationsView */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                {/* Header & Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h2 className="text-xl font-bold text-slate-800">AI & ML Predictive Analytics</h2>
                            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/70 rounded-lg flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Simulated Data
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            College-wide forecasts & individual student placement, attendance, and marks predictions
                        </p>
                    </div>

                    {/* View Switcher Pills matching your UI controls */}
                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setActiveTab('college')}
                                className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer ${activeTab === 'college'
                                        ? 'bg-[#1464F6] text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-800'
                                    }`}
                            >
                                <Building2 className="w-3.5 h-3.5" /> Whole College
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('student')}
                                className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer ${activeTab === 'student'
                                        ? 'bg-[#1464F6] text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-800'
                                    }`}
                            >
                                <UserCheck className="w-3.5 h-3.5" /> Individual Student
                            </button>
                        </div>
                    </div>
                </div>

                {/* TAB 1: WHOLE COLLEGE ANALYTICS */}
                {activeTab === 'college' && <CollegeOverviewCards data={collegeData} />}

                {/* TAB 2: INDIVIDUAL STUDENT CURRENT ANALYTICS */}
                {activeTab === 'student' && (
                    <div className="space-y-6">
                        {/* Student Filter Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">Student Analytics Lookup</h3>
                                <p className="text-xs text-slate-500">
                                    Search by Roll ID or Name to inspect live ML predictions
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="relative">
                                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Search ID or Name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-8 pr-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#1464F6]"
                                    />
                                </div>

                                <select
                                    value={selectedStudentId}
                                    onChange={(e) => setSelectedStudentId(e.target.value)}
                                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl focus:outline-none cursor-pointer"
                                >
                                    {filteredStudents.map((stu) => (
                                        <option key={stu.id} value={stu.id}>
                                            {stu.id} — {stu.name} ({stu.department}, Sem {stu.semester})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Selected Student Summary Strip */}
                        {studentAnalytics && (
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-4 rounded-xl bg-[#F4F7FE] border border-blue-100/80">
                                <div>
                                    <span className="text-[11px] font-medium text-slate-500 block">Student Name</span>
                                    <span className="text-sm font-bold text-slate-800">{studentAnalytics.name}</span>
                                </div>
                                <div>
                                    <span className="text-[11px] font-medium text-slate-500 block">Department / Sem</span>
                                    <span className="text-sm font-semibold text-slate-800">
                                        {studentAnalytics.department} • Sem {studentAnalytics.semester}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[11px] font-medium text-slate-500 block">Coding Score</span>
                                    <span className="text-sm font-semibold text-slate-800">
                                        {studentAnalytics.codingScore}/100
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[11px] font-medium text-slate-500 block">Internships</span>
                                    <span className="text-sm font-semibold text-slate-800">
                                        {studentAnalytics.internships} Completed
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[11px] font-medium text-slate-500 block">Active Backlogs</span>
                                    <span
                                        className={`text-sm font-bold \${
                      studentAnalytics.backlogs > 0 ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                                    >
                                        {studentAnalytics.backlogs}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* 3 Prediction Cards Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            <PlacementPredictor student={studentAnalytics} />
                            <AttendancePredictor student={studentAnalytics} />
                            <MarksPredictor student={studentAnalytics} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}