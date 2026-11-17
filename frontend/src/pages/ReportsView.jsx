import React from 'react';
import { departmentStats } from '../data/mockData';
import DepartmentAnalyticsChart from '../components/reports/DepartmentAnalyticsChart';
import GeneratedReportsGrid from '../components/reports/GeneratedReportsGrid';

const downloadableReports = [
  {
    title: 'Student Enrollment Report',
    desc: 'Complete department & year-wise student breakdown',
    updated: 'Nov 17, 2026',
  },
  {
    title: 'Annual Fee Collection Statement',
    desc: 'Paid receipts, pending dues, and fine summaries',
    updated: 'Nov 16, 2026',
  },
  {
    title: 'Library Circulation Audit',
    desc: 'Issued, returned, and overdue books inventory',
    updated: 'Nov 15, 2026',
  },
];

export default function ReportsView() {
  const handleDownloadCSV = (reportName) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Department,Enrolled Students,Pass Rate (%)',
        ...departmentStats.map((d) => `${d.dept},${d.students},${d.passRate}%`),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportName.toLowerCase().replace(/\s+/g, '_')}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <DepartmentAnalyticsChart
        data={departmentStats}
        onExportCSV={handleDownloadCSV}
      />

      <GeneratedReportsGrid
        reports={downloadableReports}
        onDownloadReport={handleDownloadCSV}
      />
    </div>
  );
}