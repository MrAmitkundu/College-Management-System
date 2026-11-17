import React, { useState } from 'react';
import { Save, CheckCircle2, Building, User, Bell } from 'lucide-react';

export default function SettingsView() {
  const [savedToast, setSavedToast] = useState(false);
  const [settings, setSettings] = useState({
    collegeName: 'B.B. College',
    tagline: 'Smart Management. Better Education.',
    academicYear: '2026 - 2027',
    adminName: 'Amit Kundu',
    adminEmail: 'admin@bbcollege.edu',
    emailAlerts: true,
    feeReminders: true,
    maintenanceMode: false,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="max-w-4xl space-y-6">
      {/* Save Notification Banner */}
      {savedToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          System preferences and profile settings have been saved successfully.
        </div>
      )}

      {/* Institution Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <Building className="w-5 h-5 text-[#1464F6]" />
          <h2 className="text-lg font-bold text-slate-800">Institution Profile</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">College Name</label>
            <input
              type="text"
              value={settings.collegeName}
              onChange={(e) => setSettings({ ...settings, collegeName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Academic Session</label>
            <select
              value={settings.academicYear}
              onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
            >
              <option value="2025 - 2026">2025 - 2026</option>
              <option value="2026 - 2027">2026 - 2027</option>
              <option value="2027 - 2028">2027 - 2028</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Dashboard Banner Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Admin Account */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <User className="w-5 h-5 text-[#1464F6]" />
          <h2 className="text-lg font-bold text-slate-800">Administrator Account</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Display Name</label>
            <input
              type="text"
              value={settings.adminName}
              onChange={(e) => setSettings({ ...settings, adminName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Email</label>
            <input
              type="email"
              value={settings.adminEmail}
              onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* System Toggles */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <Bell className="w-5 h-5 text-[#1464F6]" />
          <h2 className="text-lg font-bold text-slate-800">Notifications & System Controls</h2>
        </div>

        <div className="divide-y divide-slate-100 mt-2">
          {[
            { key: 'emailAlerts', title: 'Email Notifications', desc: 'Receive daily summary of new student admissions and library issues' },
            { key: 'feeReminders', title: 'Automated Fee Reminders', desc: 'Send automated alerts to students with pending semester fees' },
            { key: 'maintenanceMode', title: 'Portal Maintenance Mode', desc: 'Temporarily restrict student & faculty portal logins during updates' },
          ].map((item) => (
            <div key={item.key} className="py-4 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer shrink-0 ${
                  settings[item.key] ? 'bg-[#1464F6]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                    settings[item.key] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 bg-[#1464F6] hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save All Settings
        </button>
      </div>
    </form>
  );
}