
import React, { useState } from 'react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';

import DashboardView from './pages/DashboardView';
import StudentsView from './pages/StudentsView';
import FacultyView from './pages/FacultyView';
import TransactionsView from './pages/TransactionsView';
import ExaminationsView from './pages/ExaminationsView';
import NoticesView from './pages/NoticesView';
import ReportsView from './pages/ReportsView';
import AiAnalyticsView from './pages/AiAnalyticsView';
import SettingsView from './pages/SettingsView';

export default function App() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderMainContent = () => {
    switch (activeNav) {
      case 'Dashboard':
        return <DashboardView onNavigate={setActiveNav} />;

      case 'Students':
        return <StudentsView />;

      case 'Faculty':
        return <FacultyView />;

      case 'Transactions':
        return <TransactionsView />;

      case 'Examinations':
        return <ExaminationsView />;

      case 'Notices':
        return <NoticesView />;

      case 'Reports':
        return <ReportsView />;

      case 'AI Analytics':
        return <AiAnalyticsView />;

      case 'Settings':
        return <SettingsView />;

      default:
        return <DashboardView onNavigate={setActiveNav} />;
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#F4F7FE] text-slate-800">

      {/* Fixed Sidebar */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        sidebarOpen={sidebarOpen}
      />

      {/* Main Application */}
      <div
        className={`
          min-h-screen
          flex
          flex-col
          min-w-0
          transition-all
          duration-300
          ease-in-out
          ${
            sidebarOpen
              ? 'ml-64'
              : 'ml-20'
          }
        `}
      >

        {/* Header */}
        <div className="shrink-0">
          <Header
            onToggleSidebar={() =>
              setSidebarOpen((prev) => !prev)
            }
            onNavigate={setActiveNav}
          />
        </div>

        {/* Main Content */}
        <main
          className="
            flex-1
            min-h-[calc(100vh-200px)]
            min-w-0
            p-6
            overflow-x-hidden
          "
        >
          {renderMainContent()}
        </main>

        {/* Footer - Normal Flow */}
        <div className="shrink-0">
          <Footer />
        </div>

      </div>
    </div>
  );
}
