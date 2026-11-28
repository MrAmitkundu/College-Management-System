
import React, { useState, useEffect, useCallback } from 'react';

import {
  BarChart2,
  Bell,
  ArrowRight,
  Zap,
  Users,
  FileText,
  Calendar,
  Clock,
  AlertCircle,
  RefreshCw,
  BrainCircuit,
  GraduationCap,
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

import { activities } from '../data/mockData';

import collegeImg from '../assets/college_image.jpeg';

import {
  getDashboardOverview,
  getDashboardNotices,
} from '../services/dashboardService';

export default function DashboardView({ onNavigate }) {
  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalTransactions: 0,
    monthlyData: [],
  });

  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState('');

  const [notices, setNotices] = useState([]);
  const [noticeLoading, setNoticeLoading] = useState(true);
  const [noticeError, setNoticeError] = useState('');

  // Fetch dashboard statistics and graph data.
  const fetchDashboardData = useCallback(async () => {
    try {
      setDashboardLoading(true);
      setDashboardError('');

      const data = await getDashboardOverview(selectedYear);

      setDashboardData(data);
    } catch (error) {
      console.error('Dashboard API error:', error);

      setDashboardError(
        error.message || 'Unable to load dashboard data.'
      );
    } finally {
      setDashboardLoading(false);
    }
  }, [selectedYear]);

  // Fetch dashboard data whenever the selected year changes.
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Fetch notices from the existing Django notice API.
  const fetchNotices = useCallback(async () => {
    try {
      setNoticeLoading(true);
      setNoticeError('');

      const data = await getDashboardNotices();

      setNotices(data);
    } catch (error) {
      console.error('Notice fetching error:', error);

      setNoticeError(
        error.message || 'Unable to load notices.'
      );
    } finally {
      setNoticeLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  // Format statistics.
  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString('en-IN');
  };

  // Notice priority indicator.
  const getNoticePriorityColor = (priority) => {
    switch (String(priority || 'low').toLowerCase()) {
      case 'high':
        return 'bg-red-500';

      case 'medium':
        return 'bg-amber-500';

      case 'low':
      default:
        return 'bg-emerald-500';
    }
  };

  // Statistics cards using actual Django API data.
  const statCards = [
    {
      title: 'Total Students',
      value: dashboardData.totalStudents,
      icon: Users,
      bgIcon: 'bg-blue-600',
      color: '#1464F6',
      trend: '',
      sparkData: [],
    },
    {
      title: 'Faculty Members',
      value: dashboardData.totalFaculty,
      icon: GraduationCap,
      bgIcon: 'bg-emerald-600',
      color: '#10A56B',
      trend: '',
      sparkData: [],
    },
    {
      title: 'Transactions',
      value: dashboardData.totalTransactions,
      icon: Calendar,
      bgIcon: 'bg-orange-500',
      color: '#F68E09',
      trend: '',
      sparkData: [],
    },
  ];

  return (
    <div
      className="
        flex flex-col gap-4
        xl:h-[calc(100vh-200px)]
        xl:min-h-0
        xl:gap-3
      "
    >
      {/* Hero Banner */}
      <div
        className="
          relative
          rounded-2xl
          overflow-hidden
          shadow-md
          h-36
          sm:h-40
          xl:h-[140px]
          shrink-0
          flex items-center
        "
      >
        <img
          src={collegeImg}
          alt="College Campus"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#09327A] via-[#0F49AC]/95 to-transparent" />

        <div className="relative z-10 px-6 sm:px-8 max-w-2xl text-white">
          <h2 className="text-xl sm:text-2xl xl:text-2xl font-bold leading-snug">
            Welcome to
            <br />
            B.B. College Management System
          </h2>

          <p className="text-blue-100 text-xs sm:text-sm mt-2">
            Smart Management. Better Education.
          </p>

          <div className="w-11 h-1 bg-amber-400 rounded-full mt-3" />
        </div>
      </div>

      {/* Statistics Cards */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-3
          gap-3
          shrink-0
        "
      >
        {statCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="
                bg-white
                rounded-2xl
                p-4
                xl:p-3.5
                shadow-sm
                border border-slate-100
                flex flex-col justify-between
                hover:shadow-md
                transition
                min-w-0
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-11 h-11
                    xl:w-10 xl:h-10
                    rounded-full
                    ${card.bgIcon}
                    text-white
                    flex items-center justify-center
                    shrink-0
                    shadow-sm
                  `}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-slate-900">
                    {dashboardLoading
                      ? '...'
                      : formatNumber(card.value)}
                  </h3>

                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    {card.title}
                  </p>
                </div>
              </div>

              <div className="flex items-end justify-between mt-2">
                <span className="text-xs font-medium text-slate-400">
                  {dashboardLoading
                    ? 'Loading data...'
                    : dashboardError
                      ? 'Data unavailable'
                      : 'Live database data'}
                </span>

                <div className="w-24 h-7">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { v: 2 },
                        { v: 4 },
                        { v: 3 },
                        { v: 6 },
                        { v: 5 },
                        { v: 8 },
                      ]}
                    >
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke={card.color}
                        strokeWidth={2}
                        fill="none"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dashboard Error */}
      {dashboardError && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0" />

            <span>
              Unable to load dashboard statistics.
            </span>
          </div>

          <button
            type="button"
            onClick={fetchDashboardData}
            className="inline-flex items-center gap-2 text-xs font-semibold text-red-600 hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Middle Section */}
      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-12
          gap-3
          xl:flex-1
          xl:min-h-0
        "
      >
        {/* College Overview Chart */}
        <div
          className="
            lg:col-span-7
            xl:flex-[1.7]
            bg-white
            rounded-2xl
            p-4
            shadow-sm
            border border-slate-100
            xl:min-h-0
            flex flex-col
          "
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#092147]" />

              <h3 className="font-bold text-slate-800 text-sm">
                College Overview
              </h3>
            </div>

            <select
              value={selectedYear}
              onChange={(event) =>
                setSelectedYear(Number(event.target.value))
              }
              className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
            >
              <option value={currentYear}>This Year</option>

              <option value={currentYear - 1}>Last Year</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-4 text-xs font-medium text-slate-600 mb-2 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1464F6]" />
              Students
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7C4DFF]" />
              Transactions
            </div>
          </div>

          <div className="h-48 xl:flex-1 xl:min-h-0 w-full">
            {dashboardLoading ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Loading graph data...
              </div>
            ) : dashboardData.monthlyData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No graph data available for {selectedYear}.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dashboardData.monthlyData}
                  margin={{
                    top: 8,
                    right: 8,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="studentsGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#1464F6"
                        stopOpacity={0.25}
                      />

                      <stop
                        offset="95%"
                        stopColor="#1464F6"
                        stopOpacity={0}
                      />
                    </linearGradient>

                    <linearGradient
                      id="transGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#7C4DFF"
                        stopOpacity={0.2}
                      />

                      <stop
                        offset="95%"
                        stopColor="#7C4DFF"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical
                    stroke="#F1F5F9"
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fill: '#64748B',
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fill: '#64748B',
                    }}
                    tickFormatter={(value) =>
                      value >= 1000
                        ? `${value / 1000}K`
                        : value
                    }
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="students"
                    name="Students"
                    stroke="#1464F6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#studentsGrad)"
                    dot={{
                      r: 3,
                      fill: '#1464F6',
                      strokeWidth: 0,
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="transactions"
                    name="Transactions"
                    stroke="#7C4DFF"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#transGrad)"
                    dot={{
                      r: 3,
                      fill: '#7C4DFF',
                      strokeWidth: 0,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Latest Notices */}
        <div
          className="
            lg:col-span-5
            xl:flex-1
            bg-white
            rounded-2xl
            p-4
            shadow-sm
            border border-slate-100
            flex flex-col
            min-h-0
            overflow-hidden
          "
        >
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#1464F6]" />

              <h3 className="font-bold text-slate-800 text-sm">
                Latest Notices
              </h3>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('Notices')}
              className="text-xs font-semibold text-[#1464F6] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {noticeLoading && (
            <div className="flex-1 space-y-2 overflow-hidden">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-[42px] animate-pulse flex items-center gap-3"
                >
                  <div className="w-1 h-7 rounded-full bg-slate-200" />

                  <div className="flex-1 h-3 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          )}

          {!noticeLoading && noticeError && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-6 h-6 text-red-400 mb-2" />

              <p className="text-xs text-slate-500">
                Unable to load notices
              </p>

              <button
                type="button"
                onClick={fetchNotices}
                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#1464F6] hover:underline cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>
          )}

          {!noticeLoading &&
            !noticeError &&
            notices.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <Bell className="w-7 h-7 text-slate-300 mb-2" />

                <p className="text-xs text-slate-500">
                  No notices available.
                </p>
              </div>
            )}

          {!noticeLoading &&
            !noticeError &&
            notices.length > 0 && (
              <div className="flex-1 min-h-0 overflow-hidden divide-y divide-slate-100">
                {notices.slice(0, 6).map((notice) => {
                  const topic =
                    notice.topic ||
                    notice.notice_topic ||
                    notice.title ||
                    notice.notice_title ||
                    'Untitled Notice';

                  const publishedDate =
                    notice.published_on ||
                    notice.date ||
                    notice.created_at;

                  const priority = String(
                    notice.priority || 'Low'
                  ).toLowerCase();

                  const priorityColor =
                    getNoticePriorityColor(priority);

                  return (
                    <div
                      key={notice.notice_id ?? notice.id}
                      className="
                        h-[42px]
                        min-h-[42px]
                        max-h-[42px]
                        flex
                        items-center
                        gap-3
                        overflow-hidden
                        py-1
                      "
                    >
                      <span
                        className={`
                          w-1
                          h-7
                          rounded-full
                          shrink-0
                          ${priorityColor}
                        `}
                        title={`${priority} priority`}
                      />

                      <p
                        className="
                          flex-1
                          min-w-0
                          text-xs
                          font-medium
                          text-slate-700
                          truncate
                        "
                        title={topic}
                      >
                        {topic}
                      </p>

                      <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                        {publishedDate
                          ? new Date(
                              publishedDate
                            ).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Date unavailable'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>

      {/* Bottom Section */}
      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-12
          gap-3
          xl:min-h-0
        "
      >
        {/* Quick Actions */}
        <div
          className="
            lg:col-span-7
            xl:flex-[1.7]
            bg-white
            rounded-2xl
            p-4
            shadow-sm
            border border-slate-100
          "
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-[#1464F6] fill-[#1464F6]" />

            <h3 className="font-bold text-slate-800 text-sm">
              Quick Actions
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Add Student */}
            <button
              type="button"
              onClick={() => onNavigate('Students')}
              className="bg-gradient-to-b from-[#12A163] to-[#0B8750] hover:opacity-95 text-white rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 shadow-sm transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Users className="w-5 h-5" />

              <span className="text-xs font-semibold leading-tight">
                Add Student
              </span>
            </button>

            {/* View Reports */}
            <button
              type="button"
              onClick={() => onNavigate('Reports')}
              className="bg-gradient-to-b from-[#7E52FF] to-[#6336EB] hover:opacity-95 text-white rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 shadow-sm transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <FileText className="w-5 h-5" />

              <span className="text-xs font-semibold leading-tight">
                View Reports
              </span>
            </button>

            {/* Manage Transactions */}
            <button
              type="button"
              onClick={() => onNavigate('Transactions')}
              className="bg-gradient-to-b from-[#F68E09] to-[#E07A00] hover:opacity-95 text-white rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 shadow-sm transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Calendar className="w-5 h-5" />

              <span className="text-xs font-semibold leading-tight">
                Manage
                <br />
                Transactions
              </span>
            </button>

            {/* AI Analytics */}
            <button
              type="button"
              onClick={() => onNavigate('AI Analytics')}
              className="bg-gradient-to-b from-[#1464F6] to-[#0949B8] hover:opacity-95 text-white rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 shadow-sm transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <BrainCircuit className="w-5 h-5" />

              <span className="text-xs font-semibold leading-tight">
                AI Analytics
              </span>
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div
          className="
            lg:col-span-5
            xl:flex-1
            bg-white
            rounded-2xl
            p-4
            shadow-sm
            border border-slate-100
          "
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#1464F6]" />

              <h3 className="font-bold text-slate-800 text-sm">
                Recent Activities
              </h3>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('Reports')}
              className="text-xs font-semibold text-[#1464F6] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative pl-4 space-y-3 before:content-[''] before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-blue-100">
            {activities.map((item, index) => (
              <div
                key={index}
                className="relative flex items-center justify-between gap-3"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#1464F6] ring-4 ring-white absolute -left-4" />

                <p className="text-xs text-slate-700 truncate">
                  {item.text}
                </p>

                <span className="text-[10px] text-slate-400 shrink-0">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
