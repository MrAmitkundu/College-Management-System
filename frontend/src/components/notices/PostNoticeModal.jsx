import React, { useState } from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';

export default function PostNoticeModal({ isOpen, onClose, onPublishNotice }) {
  const [formData, setFormData] = useState({
    notice_topic: '',
    notice_description: '',
    priority: 'Medium',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    if (submitting) return;
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const topic = formData.notice_topic.trim();
    const description = formData.notice_description.trim();

    if (!topic || !description) {
      setError('Please enter both a notice topic and description.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (onPublishNotice) {
        await onPublishNotice({
          notice_topic: topic,
          notice_description: description,
          priority: formData.priority,
        });
      }

      setFormData({
        notice_topic: '',
        notice_description: '',
        priority: 'Medium',
      });
      onClose();
    } catch (err) {
      setError(err?.message || 'Unable to save notice to the database.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Post New Notice</h3>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notice Topic *
            </label>
            <input
              type="text"
              required
              maxLength={200}
              placeholder="e.g. Semester VII Examination Schedule"
              value={formData.notice_topic}
              onChange={(e) =>
                setFormData({ ...formData, notice_topic: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Announcement Details *
            </label>
            <textarea
              rows="4"
              required
              placeholder="Enter notice details..."
              value={formData.notice_description}
              onChange={(e) =>
                setFormData({ ...formData, notice_description: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Priority Level
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="w-full px-3 py-2.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
            >
              <option value="High">High Priority (Urgent)</option>
              <option value="Medium">Medium Priority (Important)</option>
              <option value="Low">Low Priority (General)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#1464F6] hover:bg-blue-700 rounded-xl shadow-sm cursor-pointer disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {submitting ? 'Publishing...' : 'Publish Notice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}