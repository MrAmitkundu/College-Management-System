import React from 'react';

export default function Footer() {
  return (
    <footer className="px-6 py-4 bg-white border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
      <p>
        © 2026 <strong className="text-slate-700">B.B. College</strong>. All rights reserved.
      </p>
      <p>Powered by B.B. College Management System &nbsp;|&nbsp; v1.0</p>
    </footer>
  );
}