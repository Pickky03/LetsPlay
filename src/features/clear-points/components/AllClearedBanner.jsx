import React from "react";

export default function AllClearedBanner({ show }) {
  if (!show) return null;
  return (
    <div className="mt-4 rounded-xl border bg-emerald-50 px-4 py-3 text-center text-emerald-700">
      <span className="font-bold">ALL CLEARED</span>
    </div>
  );
}
