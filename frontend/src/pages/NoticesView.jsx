import React, { useState } from 'react';
import { Bell, Plus } from 'lucide-react';
import { notices as initialNotices } from '../data/mockData';
import NoticeList from '../components/notices/NoticeList';
import PostNoticeModal from '../components/notices/PostNoticeModal';

export default function NoticesView() {
  const [noticesList, setNoticesList] = useState(initialNotices);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePublishNotice = (newNoticeData) => {
    const created = {
      ...newNoticeData,
      date: 'Nov 17, 2026',
    };
    setNoticesList([created, ...noticesList]);
  };

  const handleDeleteNotice = (indexToRemove) => {
    setNoticesList(noticesList.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      {/* Header & Action Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <Bell className="w-5 h-5 text-[#1464F6]" />
          <div>
            <h2 className="text-xl font-bold text-slate-800">College Notices & Circulars</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {noticesList.length} active announcements for students and faculty
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#1464F6] hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Post New Notice
        </button>
      </div>

      {/* Notices List */}
      <NoticeList
        notices={noticesList}
        onDeleteNotice={handleDeleteNotice}
        onOpenModal={() => setIsModalOpen(true)}
      />

      {/* Post Notice Modal */}
      <PostNoticeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPublishNotice={handlePublishNotice}
      />
    </div>
  );
}