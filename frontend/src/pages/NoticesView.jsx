import React, { useState, useMemo } from 'react';
import { Bell, Plus } from 'lucide-react';

import NoticeList from '../components/notices/NoticeList';
import PostNoticeModal from '../components/notices/PostNoticeModal';
import useFetchData from '../hooks/useFetchData';

const API_URL = 'http://127.0.0.1:8000/api/notice/';

export default function NoticesView() {
  const {
    data: apiNotices,
    loading,
    error,
    refetch: fetchNotices,
  } = useFetchData(API_URL);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionError, setActionError] = useState('');

  // Handle both normal arrays and Django REST Framework pagination.
  const noticesData = useMemo(() => {
    const items = Array.isArray(apiNotices)
      ? apiNotices
      : apiNotices?.results || [];

    return items.map((notice) => ({
      ...notice,
      id: notice.notice_id ?? notice.id,
      notice_topic:
        notice.notice_topic || notice.topic || notice.title || 'Untitled Notice',
      notice_description:
        notice.notice_description ||
        notice.description ||
        notice.text ||
        notice.message ||
        '',
      priority: notice.priority || 'Low',
      date: notice.date || notice.published_on || notice.created_at || '',
    }));
  }, [apiNotices]);

  // Publish notice to Django (single POST request, then refetch).
  const handlePublishNotice = async (newNoticeData) => {
    setActionError('');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNoticeData),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      const firstError =
        responseData.detail ||
        responseData.message ||
        Object.values(responseData).flat()[0] ||
        'Unable to publish notice.';
      setActionError(firstError);
      throw new Error(firstError);
    }

    setIsModalOpen(false);
    await fetchNotices();
  };

  // Delete notice using its database ID.
  const handleDeleteNotice = async (noticeId) => {
    if (!noticeId) {
      setActionError('Notice ID is missing.');
      return;
    }

    setActionError('');

    try {
      const response = await fetch(`${API_URL}${noticeId}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Unable to delete notice.');
      }

      await fetchNotices();
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <Bell className="w-5 h-5 text-[#1464F6]" />

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              College Notices & Circulars
            </h2>

            <p className="text-xs text-slate-500 mt-0.5">
              Showing {noticesData.length} active announcements for students
              and faculty
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#1464F6] hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Post New Notice
        </button>
      </div>

      {/* API action error */}
      {actionError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {actionError}
        </div>
      )}

      {/* Notices */}
      <NoticeList
        notices={noticesData}
        loading={loading}
        error={error}
        onRetry={fetchNotices}
        onDeleteNotice={handleDeleteNotice}
        onOpenModal={() => setIsModalOpen(true)}
      />

      {/* Modal */}
      <PostNoticeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPublishNotice={handlePublishNotice}
      />
    </div>
  );
}