import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import DashboardView from './pages/DashboardView';
import StudentsView from './pages/StudentsView';
import FacultyView from './pages/FacultyView';
import LibraryView from './pages/LibraryView';
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
      case 'Library':
        return <LibraryView />;
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
    <div className="min-h-screen flex bg-[#F4F7FE] text-slate-800">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNavigate={setActiveNav}
        />

        <main className="p-6 flex-1">
          {renderMainContent()}
        </main>

        <Footer />
      </div>
    </div>
  );
}