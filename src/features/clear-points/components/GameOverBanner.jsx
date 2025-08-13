import React from "react";

export default function GameOverBanner({ show }) {
  if (!show) return null;
  return (
    <div className="mt-4 rounded-xl border bg-rose-50 px-4 py-3 text-center text-rose-700">
      <span className="font-bold">GAME OVER</span>
    </div>
  );
}
