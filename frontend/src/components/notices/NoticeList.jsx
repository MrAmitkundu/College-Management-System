import React, { useMemo, useState, useEffect } from 'react';

import {
  Calendar,
  Trash2,
  RefreshCw,
  Bell,
  AlertCircle,
  ChevronDown,
  FileText,
  AlertTriangle,
} from 'lucide-react';

const NOTICES_PER_PAGE = 5;

export default function NoticeList({
  notices = [],
  onDeleteNotice,
  onOpenModal,
  loading = false,
  error = '',
  onRetry,
}) {
  const [visibleCount, setVisibleCount] = useState(NOTICES_PER_PAGE);

  // Reset pagination when notices change.
  useEffect(() => {
    setVisibleCount(NOTICES_PER_PAGE);
  }, [notices.length]);

  // Sort notices by date (newest first), breaking same-day ties by highest notice_id.
  const sortedNotices = useMemo(() => {
    return [...notices].sort((a, b) => {
      const dateA = new Date(
        a.date || a.published_on || a.created_at || 0
      ).getTime();

      const dateB = new Date(
        b.date || b.published_on || b.created_at || 0
      ).getTime();

      if (dateB !== dateA) {
        return dateB - dateA;
      }

      const idA = Number(a.notice_id ?? a.id ?? 0);
      const idB = Number(b.notice_id ?? b.id ?? 0);
      return idB - idA;
    });
  }, [notices]);

  const visibleNotices = sortedNotices.slice(0, visibleCount);

  const hasMoreNotices = visibleCount < sortedNotices.length;

  const handleLoadMore = () => {
    setVisibleCount((previousCount) =>
      Math.min(
        previousCount + NOTICES_PER_PAGE,
        sortedNotices.length
      )
    );
  };

  // Priority-based colors.
  const getPriorityStyle = (priority) => {
    const normalizedPriority = String(priority || 'low').toLowerCase();

    switch (normalizedPriority) {
      case 'high':
        return {
          card: 'border-red-200 bg-red-50/60 hover:bg-red-50',
          bar: 'bg-red-500',
          badge: 'bg-red-100 text-red-700 border-red-200',
          icon: 'text-red-600',
          label: 'High Priority',
        };

      case 'medium':
        return {
          card: 'border-amber-200 bg-amber-50/60 hover:bg-amber-50',
          bar: 'bg-amber-500',
          badge: 'bg-amber-100 text-amber-700 border-amber-200',
          icon: 'text-amber-600',
          label: 'Medium Priority',
        };

      case 'low':
      default:
        return {
          card: 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50',
          bar: 'bg-emerald-500',
          badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          icon: 'text-emerald-600',
          label: 'Low Priority',
        };
    }
  };

  // Loading state.
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse p-4 rounded-xl border border-slate-200 bg-white flex gap-4"
          >
            <div className="w-1.5 rounded-full bg-slate-200" />

            <div className="flex-1 space-y-3">
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-3 w-full rounded bg-slate-100" />
              <div className="h-3 w-1/3 rounded bg-slate-100" />
            </div>

            <div className="h-8 w-8 rounded-lg bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  // Error state.
  if (error) {
    return (
      <div className="py-12 text-center border border-red-100 bg-red-50/50 rounded-xl">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />

        <p className="text-sm font-semibold text-slate-700">
          Unable to load notices
        </p>

        <p className="text-xs text-slate-500 mt-1">
          {error}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#1464F6] bg-white border border-blue-100 rounded-lg hover:bg-blue-50 transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    );
  }

  // Empty state.
  if (sortedNotices.length === 0) {
    return (
      <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl bg-white">
        <Bell className="w-8 h-8 text-slate-300 mx-auto mb-3" />

        <p className="text-sm font-semibold text-slate-700">
          No notices available
        </p>

        <p className="text-xs text-slate-500 mt-1">
          No notices have been posted yet.
        </p>

        <button
          type="button"
          onClick={onOpenModal}
          className="mt-4 text-sm text-[#1464F6] font-semibold hover:underline cursor-pointer"
        >
          Post the first notice
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Notice List */}
      <div className="space-y-3">
        {visibleNotices.map((notice) => {
          const noticeTopic =
            notice.topic ||
            notice.notice_topic ||
            notice.title ||
            notice.notice_title ||
            'Untitled Notice';

          const noticeDescription =
            notice.description ||
            notice.notice_description ||
            notice.content ||
            notice.message ||
            'No description available.';

          const noticeDate =
            notice.date ||
            notice.published_on ||
            notice.created_at ||
            '';

          const noticeId =
            notice.notice_id ??
            notice.id;

          // Read priority from the database.
          const priority = notice.priority || 'Low';

          const priorityStyle = getPriorityStyle(priority);

          return (
            <div
              key={noticeId}
              className={`
                p-4
                rounded-xl
                border
                ${priorityStyle.card}
                hover:shadow-sm
                transition
                flex
                items-start
                justify-between
                gap-4
              `}
            >
              {/* Notice Content */}
              <div className="flex items-stretch gap-3.5 min-w-0 flex-1">
                {/* Priority Color Indicator */}
                <span
                  className={`
                    w-1.5
                    rounded-full
                    shrink-0
                    ${priorityStyle.bar}
                  `}
                />

                <div className="min-w-0 flex-1">
                  {/* Topic and Priority */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-start gap-2">
                      <FileText
                        className={`w-4 h-4 mt-0.5 shrink-0 ${priorityStyle.icon}`}
                      />

                      <h3 className="text-sm font-bold text-slate-800 leading-snug break-words">
                        {noticeTopic}
                      </h3>
                    </div>

                    {/* Priority Badge */}
                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-1
                        px-2
                        py-1
                        rounded-full
                        border
                        text-[10px]
                        font-bold
                        whitespace-nowrap
                        ${priorityStyle.badge}
                      `}
                    >
                      <AlertTriangle className="w-3 h-3" />

                      {priorityStyle.label}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-line break-words">
                    {noticeDescription}
                  </p>

                  {/* Published Date */}
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />

                    <span>
                      Published:{' '}
                      {noticeDate
                        ? new Date(noticeDate).toLocaleDateString(
                            'en-IN',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            }
                          )
                        : 'Date unavailable'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => onDeleteNotice?.(noticeId)}
                title="Delete Notice"
                aria-label={`Delete notice: ${noticeTopic}`}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-lg transition cursor-pointer shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      {hasMoreNotices && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-xs text-slate-400">
            Showing {visibleNotices.length} of{' '}
            {sortedNotices.length} notices
          </p>

          <button
            type="button"
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#1464F6] bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl transition cursor-pointer"
          >
            Load More Notices

            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* All Notices Loaded */}
      {!hasMoreNotices &&
        sortedNotices.length > NOTICES_PER_PAGE && (
          <p className="mt-6 text-center text-xs text-slate-400">
            You've reached the end of the notices.
          </p>
        )}
    </div>
  );
}